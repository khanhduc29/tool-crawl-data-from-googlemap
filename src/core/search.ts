import { Page } from "playwright";

export async function searchKeyword(
  page: Page,
  keyword: string,
  lat: number,
  lng: number
) {
  console.log(`🔎 Search Google Maps: ${keyword}`);

  const url = `https://www.google.com/maps/search/${encodeURIComponent(
    keyword
  )}/@${lat},${lng},14z`;

  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
}