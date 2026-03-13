"use strict";
// import { Page } from "playwright";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchKeyword = searchKeyword;
async function searchKeyword(page, keyword, address) {
    const query = `${keyword} ${address}`.replace(/\s+/g, " ").trim();
    console.log(`🔎 Search Google Maps: ${query}`);
    const url = "https://www.google.com/maps/search/" +
        encodeURIComponent(query);
    await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
    });
    // đợi maps render
    await page.waitForTimeout(4000);
    // chờ sidebar hoặc place card
    await Promise.race([
        page.waitForSelector('div[role="feed"]', { timeout: 15000 }),
        page.waitForSelector("a.hfpxzc", { timeout: 15000 }),
        page.waitForSelector('div:has-text("No results")', { timeout: 15000 })
    ]);
}
