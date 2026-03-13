"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTaskQueue = startTaskQueue;
const crawlTask_api_1 = require("../api/crawlTask.api");
const processTask_1 = require("./processTask");
const delay_1 = require("../utils/delay");
async function startTaskQueue() {
    console.log("📡 Task queue started");
    while (true) {
        try {
            const task = await (0, crawlTask_api_1.getNextTask)();
            if (!task) {
                console.log("⏳ No task, waiting...");
                await (0, delay_1.delay)(25000);
                continue;
            }
            console.log(`📥 Got task ${task._id}`);
            await (0, processTask_1.processTask)(task);
        }
        catch (err) {
            console.error("❌ Queue error:", err.message);
            await (0, delay_1.delay)(5000);
        }
    }
}
