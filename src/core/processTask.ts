

import { CrawlTask } from "../types/crawlTask";
import { createBrowser } from "../config/browser";
import { searchKeyword } from "./search";
import { crawlWithAutoScroll } from "./crawlWithAutoScroll";
import { updateTask } from "../api/crawlTask.api";
import { crawlWebsiteContact } from "./crawlWebsiteContact";
import { deepScanPlace } from "./deepScanPlace";
import { delay } from "../utils/delay";

export async function processTask(task: CrawlTask) {

  console.log(`🚀 Start task ${task._id}`);
  console.log(
    `🧾 keyword="${task.keyword}", address="${task.address}"`
  );

  try {

    /**
     * 1️⃣ Open browser
     */
    const context = await createBrowser();
    const page = await context.newPage();

    /**
     * 2️⃣ Search Google Maps
     */
    await searchKeyword(
      page,
      task.keyword,
      task.address
    );

    /**
     * 3️⃣ Crawl places
     */
    const results = await crawlWithAutoScroll(
      page,
      task.result_limit
    );

    /**
     * 4️⃣ Crawl website
     */
    if (task.deep_scan_website) {

      console.log("🌐 Deep scan website ENABLED");

      for (const place of results) {

        if (!place.website) continue;

        const webPage = await context.newPage();

        await delay(2000);

        try {

          place.socials = await crawlWebsiteContact(
            webPage,
            place.website
          );

        } catch {

          console.log(
            `⚠️ Website crawl failed: ${place.website}`
          );

        } finally {

          await webPage.close();

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

          results[i] = await deepScanPlace(
            detailPage,
            results[i]
          );

        } catch {

          console.log(
            `⚠️ Deep scan failed: ${results[i].name}`
          );

        } finally {

          await detailPage.close();

        }

      }

    }

    await context.close();

    /**
     * 6️⃣ Update task
     */
    await updateTask(task._id, {
      status: "success",
      result: results,
    });

    console.log(
      `✅ Task ${task._id} success | result=${results.length}`
    );

  } catch (err: any) {

    console.error(`❌ Task ${task._id} error`, err.message);

    await updateTask(task._id, {
      status: "error",
      error_message: err.message,
    });

  }

}