import { Page } from "playwright";
import { SocialLinks } from "../types/social";

export async function crawlWebsiteContact(
  page: Page,
  website: string
): Promise<SocialLinks> {
  console.log(`🌐 Crawl website: ${website}`);

  await page.goto(website, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  const html = await page.content();

  return {
    facebook: html.match(/facebook\.com\/[^\s"'<>]+/)?.[0] || null,
    instagram: html.match(/instagram\.com\/[^\s"'<>]+/)?.[0] || null,
    tiktok: html.match(/tiktok\.com\/[^\s"'<>]+/)?.[0] || null,
    youtube: html.match(/youtube\.com\/[^\s"'<>]+/)?.[0] || null,
  };
}