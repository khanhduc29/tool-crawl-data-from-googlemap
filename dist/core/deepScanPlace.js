"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepScanPlace = deepScanPlace;
/**
 * Quét sâu Google Maps place detail
 */
async function deepScanPlace(page, place) {
    console.log(`🧠 Deep scan place: ${place.name}`);
    if (!place.url)
        return place;
    await page.goto(place.url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
    });
    const description = await page
        .locator('[data-item-id="about"]')
        .first()
        .textContent()
        .catch(() => null);
    return {
        ...place,
        description: description?.trim() || undefined,
    };
}
