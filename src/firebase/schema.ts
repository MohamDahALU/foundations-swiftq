import type { Timestamp } from "firebase/firestore";

export interface Queue {
  id: string;
  hostId: string;
  hostName: string;
  queueName: string;
  createdAt: Timestamp;
  isActive: boolean;
  requireCustomerName: boolean;
  estimatedWaitPerPerson?: number;
  waitTimes?: number[];
}

export interface QueueItem {
  id: string;
  data: Queue;
}

export interface Customer {
  name: string;
  joinedAt: Timestamp;
  status: "waiting" | "served" | "skipped" | "notified" | "exited" | "removed"; // Added "exited" status
  position: number;
  notified?: boolean;
  notifiedAt?: Timestamp;
  servedAt?: Timestamp;
  exitedAt?: Timestamp; // Added timestamp for when customer exited
}

export interface CustomerItem {
  id: string;
  data: Customer;
}