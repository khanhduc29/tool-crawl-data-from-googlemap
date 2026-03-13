"use strict";
// import axios from "axios";
// import { CrawlTask } from "../types/crawlTask";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextTask = getNextTask;
exports.updateTask = updateTask;
// const API_BASE =
//   "https://tool-map-crawl-be-2.onrender.com/api";
// /**
//  * Lấy 1 crawl_task pending từ BE
//  * Worker KHÔNG map job → task
//  */
// export async function getNextTask(): Promise<CrawlTask | null> {
//   const res = await axios.get(`${API_BASE}/crawl-tasks`, {
//     params: {
//       status: "pending",
//       limit: 1,
//     },
//   });
//   const tasks = res.data?.data;
//   if (!tasks || tasks.length === 0) {
//     console.log("⏳ No pending crawl task");
//     return null;
//   }
//   const task: CrawlTask = tasks[0];
//   console.log("📥 Picked crawl task:", task);
//   return task;
// }
// /**
//  * Update crawl_task (processing / success / error)
//  */
// export async function updateTask(
//   taskId: string,
//   payload: Partial<CrawlTask>
// ) {
//   await axios.put(
//     `${API_BASE}/crawl-tasks/${taskId}`,
//     payload
//   );
// }
const axios_1 = __importDefault(require("axios"));
const API_BASE = "https://be-tool-crawldata.onrender.com/api";
/**
 * Lấy 1 Google Map task pending từ BE mới
 * BE sẽ tự động chuyển status: pending → processing
 */
async function getNextTask() {
    const res = await axios_1.default.get(`${API_BASE}/google-map/task/pending`);
    // BE mới trả về { success, data }
    const task = res.data?.data ?? null;
    if (!task) {
        console.log("⏳ No pending Google Map task");
        return null;
    }
    console.log("📥 Picked Google Map task:", task._id, task.keyword);
    return task;
}
/**
 * Update Google Map task (success / error)
 * Worker KHÔNG set processing
 */
async function updateTask(taskId, payload) {
    await axios_1.default.patch(`${API_BASE}/google-map/task/${taskId}`, payload);
}
