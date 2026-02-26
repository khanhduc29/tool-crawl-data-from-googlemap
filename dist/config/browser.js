"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBrowser = createBrowser;
const playwright_1 = require("playwright");
async function createBrowser(lat, lng) {
    return playwright_1.chromium.launchPersistentContext("profiles/default", {
        headless: false,
        viewport: { width: 1280, height: 800 },
        permissions: ["geolocation"],
        geolocation: lat && lng ? { latitude: lat, longitude: lng } : undefined,
    });
}
