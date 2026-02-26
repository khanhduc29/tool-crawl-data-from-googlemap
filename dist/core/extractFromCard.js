"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPlaceFromCard = extractPlaceFromCard;
/**
 * Extract Place từ GOOGLE MAPS CARD (LIST VIEW)
 * - Không click
 * - Không phụ thuộc thứ tự DOM
 * - Semantic + regex
 */
async function extractPlaceFromCard(card) {
    return await card.evaluate((el) => {
        const text = (e) => e?.textContent?.trim() || null;
        // 🔹 NAME (ổn định nhất)
        const name = text(el.querySelector(".qBF1Pd.fontHeadlineSmall")) ||
            text(el.querySelector('[role="heading"]'));
        // 🔹 Rating + review (aria-label)
        const ratingLabel = el
            .querySelector('span[aria-label*="sao"], span[aria-label*="star"]')
            ?.getAttribute("aria-label") || null;
        let rating = null;
        let totalReviews = null;
        if (ratingLabel) {
            const r = ratingLabel.replace(",", ".").match(/\d+(\.\d+)?/);
            const rv = ratingLabel.match(/\((\d+)\)|(\d+)\s+/);
            rating = r ? parseFloat(r[0]) : null;
            totalReviews = rv ? parseInt(rv[1] || rv[2]) : null;
        }
        // 🔹 Website (semantic)
        const website = el.querySelector('a[data-value="Trang web"], a[data-value="Website"]')?.href || null;
        // 🔹 Phone (pattern-based)
        const phone = Array.from(el.querySelectorAll("span"))
            .map((s) => s.textContent?.trim())
            .find((t) => t?.startsWith("+")) || null;
        // 🔹 Address (heuristic – France + global)
        const texts = Array.from(el.querySelectorAll("span"))
            .map((s) => s.textContent?.trim())
            .filter(Boolean);
        const address = texts.find((t) => /\d+.*(Rue|Avenue|Av\.|Boulevard|Bd|Street|Road|St)/i.test(t)) || null;
        return {
            name,
            address,
            phone,
            website,
            rating,
            totalReviews,
            openingHours: null,
            lat: null,
            lng: null,
            url: null,
            crawledAt: new Date().toISOString(),
        };
    });
}
