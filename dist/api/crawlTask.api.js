"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextTask = getNextTask;
exports.updateTask = updateTask;
const axios_1 = __importDefault(require("axios"));
const API_BASE = "https://tool-map-crawl-be-2.onrender.com/api";
/**
 * Lấy 1 crawl_task pending từ BE
 * Worker KHÔNG map job → task
 */
async function getNextTask() {
    const res = await axios_1.default.get(`${API_BASE}/crawl-tasks`, {
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
    const task = tasks[0];
    console.log("📥 Picked crawl task:", task);
    return task;
}
/**
 * Update crawl_task (processing / success / error)
 */
async function updateTask(taskId, payload) {
    await axios_1.default.put(`${API_BASE}/crawl-tasks/${taskId}`, payload);
}
