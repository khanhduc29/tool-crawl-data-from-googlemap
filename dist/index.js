"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const taskQueue_1 = require("./core/taskQueue");
console.log("🚀 CRAWL WORKER STARTED");
(0, taskQueue_1.startTaskQueue)();
