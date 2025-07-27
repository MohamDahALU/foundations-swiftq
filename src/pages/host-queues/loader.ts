// src/pages/my-queues/loader.ts
import { requireAuth } from "../../firebase/authLoaders";
import { getHostQueues, getQueueCustomers } from "../../firebase/services/queues";

export async function HostQueueLoader() {
  try {
    // This will redirect to login if not authenticated
    await requireAuth();
    
    // If we get here, user is authenticated
    const data = await getHostQueues();
    const queues = await Promise.all(data.map(async (qu) => ({
      ...qu,
      count: (await getQueueCustomers(qu.id)).length
    })));
    
    return {queues};
  } catch (err: unknown) {
    // If this is a redirect response from requireAuth, pass it through
    if (err instanceof Response && err.status === 302) {
      throw err;
    }
    
    throw new Response("Failed To Fetch Queues", { status: 500 });
  }
}