import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config";
import { getAuth } from "firebase/auth";
import type { Queue, Customer } from "../schema";
import { generateId } from "../../utils/utils";

// Host functions - require authentication
export const createQueue = async (
  queueName: string,
  requireCustomerName: boolean = false,
  estimatedWaitPerPerson?: number
): Promise<string> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("You must be logged in to create a queue");
    }

    const docRef = await addDoc(collection(db, "queues"), {
      id: generateId(),
      hostId: user.uid,
      hostName: user.displayName || "Host",
      queueName,
      createdAt: serverTimestamp(),
      isActive: true,
      requireCustomerName,
      estimatedWaitPerPerson: estimatedWaitPerPerson || null,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating queue:", error);
    throw error;
  }
};

export const getHostQueues = async (): Promise<
  { id: string; data: Queue }[]
> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Not authenticated");
    }

    const queuesQuery = query(
      collection(db, "queues"),
      where("hostId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(queuesQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data() as Queue,
    }));
  } catch (error) {
    console.error("Error fetching queues:", error);
    throw error;
  }
};
// Public functions - no auth required

export const getQueueCustomers = async (
  queueId: string
): Promise<{ id: string; data: Customer }[]> => {
  const customersRef = collection(db, "queues", queueId, "customers");
  const customersQuery = query(
    customersRef,
    where("status", "in", ["waiting", "notified"])
  );

  const customersSnapshot = await getDocs(customersQuery);
  console.log(customersSnapshot);

  return customersSnapshot.docs.map((i) => ({
    id: i.id,
    data: i.data() as Customer,
  }));
};

export const getQueue = async (
  queueId: string
): Promise<{ id: string; data: Queue } | null> => {
  try {
    const queuesQuery = query(
      collection(db, "queues"),
      where("id", "==", queueId.toUpperCase())
    );
    const querySnapshot = await getDocs(queuesQuery);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        data: doc.data() as Queue,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching queue:", error);
    throw error;
  }
};

// Customer functions - no auth required
export const joinQueue = async (
  queueId: string,
  customerName?: string
): Promise<string> => {
  try {
    // First check if the queue exists and is active
    const queueDoc = await getDoc(doc(db, "queues", queueId));

    if (!queueDoc.exists()) {
      throw new Error("Queue not found");
    }

    const queueData = queueDoc.data() as Queue;

    if (!queueData.isActive) {
      throw new Error("This queue is currently not accepting new customers");
    }

    // Check if customer name is required but not provided
    if (queueData.requireCustomerName && !customerName) {
      throw new Error("This queue requires you to provide your name");
    }

    // Find the current position in queue
    const customersRef = collection(db, "queues", queueId, "customers");

    const customersQuery = query(
      customersRef,
      where("status", "in", ["waiting", "notified"])
    );
    const customersSnapshot = await getDocs(customersQuery);

    // Sort the results to find the highest position
    const sortedCustomers = customersSnapshot.docs
      .map((doc) => doc.data() as Customer)
      .sort((a, b) => b.position - a.position);

    const position =
      sortedCustomers.length > 0 ? sortedCustomers[0].position + 1 : 1;

    // Add the customer to the queue
    const customerRef = await addDoc(
      collection(db, "queues", queueId, "customers"),
      {
        name: customerName || `Customer ${position}`,
        joinedAt: serverTimestamp(),
        position,
        status: "waiting",
        notified: false,
      }
    );

    // Save customer ID in localStorage for quick access
    const queueHistory = JSON.parse(
      localStorage.getItem("queue_history") || "[]"
    );
    queueHistory.push({
      queueId,
      queueName: queueData.queueName,
      customerId: customerRef.id,
      joinedAt: new Date().toISOString(),
    });
    localStorage.setItem("queue_history", JSON.stringify(queueHistory));

    return customerRef.id;
  } catch (error) {
    console.error("Error joining queue:", error);
    throw error;
  }
};

export const getCustomerStatus = async (
  queueId: string,
  customerId: string
): Promise<Customer | null> => {
  try {
    const customerRef = doc(db, "queues", queueId, "customers", customerId);
    const customerSnap = await getDoc(customerRef);

    if (customerSnap.exists()) {
      return customerSnap.data() as Customer;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching customer status:", error);
    throw error;
  }
};

export const getCustomerPosition = async (
  queueId: string,
  customerId: string
): Promise<{
  position: number;
  totalAhead: number;
  estimatedWaitTime: number | null;
}> => {
  try {
    // Get customer data
    const customerRef = doc(db, "queues", queueId, "customers", customerId);
    const customerSnap = await getDoc(customerRef);

    if (!customerSnap.exists()) {
      throw new Error("Customer not found");
    }

    const customerData = customerSnap.data() as Customer;

    // Get queue data
    const queueRef = doc(db, "queues", queueId);
    const queueSnap = await getDoc(queueRef);

    if (!queueSnap.exists()) {
      throw new Error("Queue not found");
    }

    const queueData = queueSnap.data() as Queue;

    // Count customers ahead in line
    const customersRef = collection(db, "queues", queueId, "customers");
    const customersQuery = query(
      customersRef,
      where("status", "in", ["waiting", "notified"])
    );

    const customersSnap = await getDocs(customersQuery);
    const totalAhead = customersSnap.size;

    // Calculate estimated wait time if available
    let estimatedWaitTime = null;
    if (queueData.estimatedWaitPerPerson) {
      estimatedWaitTime = totalAhead * queueData.estimatedWaitPerPerson;
    }

    return {
      position: customerData.position,
      totalAhead,
      estimatedWaitTime,
    };
  } catch (error) {
    console.error("Error calculating position:", error);
    throw error;
  }
};

export const deleteQueue = async (queueId: string) => {
  const queueRef = doc(db, "queues", queueId);
  await deleteDoc(queueRef);
};

// Analytics functions - require authentication
export const getQueueAnalytics = async (
  queueId: string
): Promise<{ id: string; data: Customer }[]> => {
  try {
    const customersRef = collection(db, "queues", queueId, "customers");
    const customersQuery = query(customersRef, where("status", "==", "served"));

    const customersSnapshot = await getDocs(customersQuery);
    return customersSnapshot.docs.map((i) => ({
      id: i.id,
      data: i.data() as Customer,
    }));
  } catch (error) {
    console.error("Error fetching queue analytics:", error);
    throw error;
  }
};

export const getAllCustomersForHost = async (): Promise<
  {
    queueId: string;
    queueName: string;
    customers: { id: string; data: Customer }[];
  }[]
> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Not authenticated");
    }

    // Get all queues first
    const queues = await getHostQueues();
    const result = [];

    // For each queue, get all its customers
    for (const queue of queues) {
      const customersRef = collection(db, "queues", queue.id, "customers");
      const customersSnapshot = await getDocs(customersRef);

      result.push({
        queueId: queue.id,
        queueName: queue.data.queueName,
        customers: customersSnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data() as Customer,
        })),
      });
    }

    return result;
  } catch (error) {
    console.error("Error fetching all customer data:", error);
    throw error;
  }
};

// Function to handle customer exiting a queue
export const exitQueue = async (
  queueId: string,
  customerId: string
): Promise<void> => {
  try {
    const customerRef = doc(db, "queues", queueId, "customers", customerId);
    await updateDoc(customerRef, {
      status: "exited",
      exitedAt: serverTimestamp(),
    });

    // Save to local storage history that this customer exited
    const queueHistory = JSON.parse(
      localStorage.getItem("queue_history") || "[]"
    );

    // Update the queue history to mark this customer as exited
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedHistory = queueHistory.map((item: any) => {
      if (item.customerId === customerId && item.queueId === queueId) {
        return { ...item, exited: true, exitedAt: new Date().toISOString() };
      }
      return item;
    });

    localStorage.setItem("queue_history", JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Error exiting queue:", error);
    throw error;
  }
};

// Function to handle host removing a customer from queue
export const removeCustomer = async (
  queueId: string,
  customerId: string
): Promise<void> => {
  try {
    const customerRef = doc(db, "queues", queueId, "customers", customerId);
    await updateDoc(customerRef, {
      status: "removed",
      removedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error removing customer:", error);
    throw error;
  }
};
