"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTask = processTask;
const browser_1 = require("../config/browser");
const resolveLatLng_1 = require("./resolveLatLng");
const search_1 = require("./search");
const crawlWithAutoScroll_1 = require("./crawlWithAutoScroll");
const crawlTask_api_1 = require("../api/crawlTask.api");
const crawlWebsiteContact_1 = require("./crawlWebsiteContact");
const deepScanPlace_1 = require("./deepScanPlace");
const delay_1 = require("../utils/delay");
async function processTask(task) {
    console.log(`🚀 Start task ${task.id}`);
    console.log(`🧾 keyword="${task.keyword}", address="${task.address}"`);
    try {
        /**
         * 1️⃣ Resolve lat/lng (CHƯA update gì)
         */
        const ctxResolve = await (0, browser_1.createBrowser)();
        const pageResolve = await ctxResolve.newPage();
        const { lat, lng } = await (0, resolveLatLng_1.resolveLatLngFromAddress)(pageResolve, task.address);
        await ctxResolve.close();
        /**
         * 2️⃣ TỚI ĐÂY MỚI COI LÀ TOOL BẮT ĐẦU CHẠY
         */
        await (0, crawlTask_api_1.updateTask)(task.id, {
            status: "processing",
        });
        /**
         * 3️⃣ Crawl Google Maps (CHỈ TRUYỀN lat, lng)
         */
        const context = await (0, browser_1.createBrowser)(lat, lng);
        const page = await context.newPage();
        await (0, search_1.searchKeyword)(page, task.keyword, lat, lng);
        const results = await (0, crawlWithAutoScroll_1.crawlWithAutoScroll)(page, task.result_limit);
        /**
         * 4️⃣ deep_scan_website → crawl website / social
         */
        if (task.deep_scan_website) {
            console.log("🌐 Deep scan website ENABLED");
            for (const place of results) {
                if (!place.website)
                    continue;
                const webPage = await context.newPage();
                await (0, delay_1.delay)(2000);
                try {
                    place.socials = await (0, crawlWebsiteContact_1.crawlWebsiteContact)(webPage, place.website);
                }
                catch (err) {
                    console.log(`⚠️ Website crawl failed: ${place.website}`);
                }
                finally {
                    await webPage.close();
                }
            }
        }
        /**
         * 5️⃣ deep_scan → crawl chi tiết Google Maps
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
         * 6️⃣ UPDATE TASK → success + result[]
         */
        await (0, crawlTask_api_1.updateTask)(task.id, {
            status: "success",
            result: results,
        });
        console.log(`✅ Task ${task.id} success | result=${results.length}`);
    }
    catch (err) {
        console.error(`❌ Task ${task.id} error`, err.message);
        await (0, crawlTask_api_1.updateTask)(task.id, {
            status: "error",
            error_message: err.message,
        });
    }
}
