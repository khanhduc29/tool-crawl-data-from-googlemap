import axios from "axios";
import { CrawlTask } from "../types/crawlTask";

const API_BASE =
  "https://tool-map-crawl-be-2.onrender.com/api";

/**
 * Lấy 1 crawl_task pending từ BE
 * Worker KHÔNG map job → task
 */
export async function getNextTask(): Promise<CrawlTask | null> {
  const res = await axios.get(`${API_BASE}/crawl-tasks`, {
    params: {
      status: "pending",
      limit: 1,
    },
  });

  const tasks = res.data?.data;

  if (!tasks || tasks.length === 0) {
    console.log("⏳ No pending crawl task");
    return null;
  }

  const task: CrawlTask = tasks[0];

  console.log("📥 Picked crawl task:", task);
  return task;
}

/**
 * Update crawl_task (processing / success / error)
 */
export async function updateTask(
  taskId: string,
  payload: Partial<CrawlTask>
) {
  await axios.put(
    `${API_BASE}/crawl-tasks/${taskId}`,
    payload
  );
}