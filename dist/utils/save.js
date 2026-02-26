"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveJSON = saveJSON;
const fs_1 = __importDefault(require("fs"));
function saveJSON(path, data) {
    fs_1.default.writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
}
