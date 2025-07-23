import type { LoaderFunctionArgs } from "react-router-dom";
import { getQueue, getQueueCustomers } from "../../firebase/services/queues";

export async function JoinQueueLoader({ params }: LoaderFunctionArgs) {
  const { queueId } = params;
  if (!queueId) {
    throw new Response("Queue ID is required", { status: 400 });
  }

  try {
    // Get queue data and customers in parallel
    const [queueResponse] = await Promise.all([
      getQueue(queueId),
    ]);
    if (!queueResponse) {
      throw new Response("Queue not found", { status: 404 });
    }
    const customers = await getQueueCustomers(queueResponse?.id || "")

    // Get previous positions from localStorage
    const allPrevPoses = JSON.parse(localStorage.getItem("queue_history") || "null") as
      Record<"customerId" | "joinedAt" | "queueId" | "queueName", string>[] || [];
    const filteredPrevPoses = allPrevPoses.filter(i => i.queueId === queueResponse.id);

    // Filter customers to find previous positions
    const prevPositions = customers.filter(i =>
      filteredPrevPoses.some(j => i.id === j.customerId)
    );

    return {
      queue: queueResponse,
      prevPositions
    };
  } catch (error) {
    console.log("Error in join queue loader:", error);
    throw error
    // throw new Response("Failed to load queue information", { status: 500 });
  }
}
