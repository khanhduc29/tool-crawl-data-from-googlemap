


import { Page } from "playwright";
import { extractPlace } from "./extract";
import { Place } from "../types/place";

export async function crawlWithAutoScroll(
  page: Page,
  limit: number
): Promise<Place[]> {
  const results: Place[] = [];
  const seenUrls = new Set<string>();

  let stuckRounds = 0;
  let lastName = ""; // giữ state panel hiện tại

  while (results.length < limit) {
    console.log(`🔄 Loop | current=${results.length}`);

    // ⏳ chờ feed
    await page.waitForSelector('div[role="feed"]', { timeout: 20000 });

    await page.waitForFunction(() => {
      const feed = document.querySelector('div[role="feed"]');
      return feed && feed.querySelectorAll('a.hfpxzc').length > 0;
    }, { timeout: 2000 });

    const links = await page.$$('a.hfpxzc');
    let newFoundThisRound = 0;

    // scroll nhẹ
    await page.evaluate(() => {
      const feed = document.querySelector('div[role="feed"]');
      if (feed) feed.scrollTop = feed.scrollHeight / 2;
    });
    await page.waitForTimeout(800);

    for (const link of links) {
      if (results.length >= limit) break;

      try {
        const href = await link.getAttribute("href");
        if (!href || seenUrls.has(href)) continue;

        await link.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);

        // 🔥 BẮT BUỘC: lưu trạng thái panel trước
        const prevName = lastName;

        // 🔥 CLICK ĐÚNG PHẦN TỬ
        await link.click({ force: true });

        // 🔥 ĐỢI PANEL ACTIVE ĐỔI PLACE (FAIL FAST)
        try {
          await page.waitForFunction(
            ({ prevName }) => {
              const panels = document.querySelectorAll('div.tAiQdd');
              if (!panels.length) return false;

              const panel = panels[panels.length - 1];
              const name = panel
                .querySelector('h1.DUwDvf')
                ?.textContent?.trim();

              return !!name && name !== prevName;
            },
            { prevName },
            { timeout: 3000 }
          );
        } catch {
          // panel không đổi → skip
          continue;
        }

        // ⏳ delay rất ngắn cho Maps render
        await page.waitForTimeout(200);

        // 🔥 LẤY NAME TỪ PANEL ACTIVE
        const currentName = await page.evaluate(() => {
          const panels = document.querySelectorAll('div.tAiQdd');
          const panel = panels[panels.length - 1];
          return (
            panel?.querySelector('h1.DUwDvf')?.textContent?.trim() || ""
          );
        });

        if (!currentName || currentName === lastName) {
          continue;
        }

        lastName = currentName;

        // 🔥 extractPlace đọc panel active
        const place = await extractPlace(page);

        if (place.name) {
          place.url = href;
          results.push(place);
          seenUrls.add(href);
          newFoundThisRound++;

          console.log(`✅ ${results.length}. ${place.name}`);
        }
      } catch {
        continue;
      }
    }

    // 📜 scroll để load batch mới
    await page.evaluate(() => {
      const feed = document.querySelector('div[role="feed"]');
      if (feed) feed.scrollTop = feed.scrollHeight;
    });

    await page.waitForTimeout(500);

    // 🧠 kiểm tra stuck
    if (newFoundThisRound === 0) {
      stuckRounds++;
      console.log(`⚠️ No new data (stuck=${stuckRounds})`);
    } else {
      stuckRounds = 0;
    }

    if (stuckRounds >= 2) {
      console.log("🛑 No more data, stop crawling");
      break;
    }
  }

  return results;
}
