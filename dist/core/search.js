"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchKeyword = searchKeyword;
async function searchKeyword(page, keyword, lat, lng) {
    console.log(`🔎 Search Google Maps: ${keyword}`);
    const url = `https://www.google.com/maps/search/${encodeURIComponent(keyword)}/@${lat},${lng},14z`;
    await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
    });
}
