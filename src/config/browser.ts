import { chromium } from "playwright";

export async function createBrowser(lat?: number, lng?: number) {
  return chromium.launchPersistentContext("profiles/default", {
    headless: false,
    viewport: { width: 1280, height: 800 },
    permissions: ["geolocation"],
    geolocation:
      lat && lng ? { latitude: lat, longitude: lng } : undefined,
  });
}