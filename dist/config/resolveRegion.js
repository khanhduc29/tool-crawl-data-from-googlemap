"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRegion = resolveRegion;
function resolveRegion(lat, lng) {
    // 🇻🇳 Việt Nam
    if (lat >= 8 && lat <= 24 && lng >= 102 && lng <= 110) {
        return {
            name: "Vietnam",
            locale: "vi-VN",
            timezoneId: "Asia/Ho_Chi_Minh",
            profileKey: "vn",
        };
    }
    // 🇯🇵 Nhật Bản
    if (lat >= 30 && lat <= 46 && lng >= 129 && lng <= 146) {
        return {
            name: "Japan",
            locale: "ja-JP",
            timezoneId: "Asia/Tokyo",
            profileKey: "jp",
        };
    }
    // 🇺🇸 Mỹ
    if (lat >= 24 && lat <= 49 && lng >= -125 && lng <= -66) {
        return {
            name: "UnitedStates",
            locale: "en-US",
            timezoneId: "America/New_York",
            profileKey: "us",
        };
    }
    // 🇨🇦 Canada
    if (lat >= 42 && lat <= 83 && lng >= -141 && lng <= -52) {
        return {
            name: "Canada",
            locale: "en-CA",
            timezoneId: "America/Toronto",
            profileKey: "ca",
        };
    }
    // 🌍 Default toàn cầu
    return {
        name: "Global",
        locale: "en-US",
        timezoneId: "UTC",
        profileKey: "global",
    };
}
