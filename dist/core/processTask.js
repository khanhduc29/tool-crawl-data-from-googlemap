"use strict";
// import { CrawlTask } from "../types/crawlTask";
// import { createBrowser } from "../config/browser";
// import { searchKeyword } from "./search";
// import { crawlWithAutoScroll } from "./crawlWithAutoScroll";
// import { updateTask } from "../api/crawlTask.api";
// import { crawlWebsiteContact } from "./crawlWebsiteContact";
// import { deepScanPlace } from "./deepScanPlace";
// import { delay } from "../utils/delay";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTask = processTask;
const browser_1 = require("../config/browser");
const search_1 = require("./search");
const crawlWithAutoScroll_1 = require("./crawlWithAutoScroll");
// import { updateTask } from "../api/crawlTask.api";
const crawlWebsiteContact_1 = require("./crawlWebsiteContact");
const deepScanPlace_1 = require("./deepScanPlace");
const crawlTask_api_1 = require("../api/crawlTask.api");
async function processTask(task) {
    console.log(`🚀 Start task ${task._id}`);
    console.log(`🧾 keyword="${task.keyword}", address="${task.address}"`);
    try {
        /**
         * 1️⃣ Open browser
         */
        const context = await (0, browser_1.createBrowser)();
        const page = await context.newPage();
        /**
         * 2️⃣ Search Google Maps
         */
        await (0, search_1.searchKeyword)(page, task.keyword, task.address);
        /**
         * 3️⃣ Crawl places
         */
        const results = await (0, crawlWithAutoScroll_1.crawlWithAutoScroll)(page, task.result_limit);
        /**
         * 4️⃣ Crawl website
         */
        if (task.deep_scan_website) {
            console.log("🌐 Deep scan website ENABLED");
            for (let i = 0; i < results.length; i++) {
                let website = results[i].website;
                /**
                 * Nếu chưa có website → click detail
                 */
                if (!website) {
                    try {
                        const cards = await page.locator('div[role="article"]').all();
                        if (!cards[i])
                            continue;
                        await cards[i].locator("a.hfpxzc").click();
                        await page.waitForSelector('a[data-item-id="authority"]', { timeout: 4000 });
                        website = await page
                            .locator('a[data-item-id="authority"]')
                            .first()
                            .getAttribute("href");
                        if (website) {
                            results[i].website = website;
                        }
                    }
                    catch {
                        console.log(`⚠️ Cannot get website for ${results[i].name}`);
                    }
                }
                /**
                 * Nếu có website → crawl
                 */
                if (website) {
                    const webPage = await context.newPage();
                    try {
                        results[i].socials = await (0, crawlWebsiteContact_1.crawlWebsiteContact)(webPage, website);
                    }
                    catch {
                        console.log(`⚠️ Website crawl failed: ${website}`);
                    }
                    finally {
                        await webPage.close();
                    }
                }
            }
        }
        /**
         * 5️⃣ Deep scan Google Maps
         */
        if (task.deep_scan) {
            console.log("🧠 Deep scan place detail ENABLED");
            for (let i = 0; i < results.length; i++) {
                const detailPage = await context.newPage();
                try {
                    results[i] = await (0, deepScanPlace_1.deepScanPlace)(detailPage, results[i]);
                }
                catch {
                    console.log(`⚠️ Deep scan failed: ${results[i].name}`);
                }
                finally {
                    await detailPage.close();
                }
            }
        }
        await context.close();
        /**
         * 6️⃣ Save result to JSON (for testing)
         */
        // const filePath = `./test-result-${task._id}.json`;
        // fs.writeFileSync(
        //   filePath,
        //   JSON.stringify(results, null, 2),
        //   "utf-8"
        // );
        // console.log(`💾 Saved result to ${filePath}`);
        /**
         * 7️⃣ Update task (disabled for testing)
         */
        await (0, crawlTask_api_1.updateTask)(task._id, {
            status: "success",
            result: results,
        });
        console.log(`✅ Task ${task._id} success | result=${results.length}`);
    }
    catch (err) {
        console.error(`❌ Task ${task._id} error`, err.message);
        /**
         * Update task (disabled for testing)
         */
        await (0, crawlTask_api_1.updateTask)(task._id, {
            status: "error",
            error_message: err.message,
        });
    }
}
