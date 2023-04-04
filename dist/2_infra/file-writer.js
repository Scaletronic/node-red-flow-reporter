"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeOutputPart = exports.addOutputPart = void 0;
const fs_1 = require("fs");
const outputParts = [];
function addOutputPart(outputPart) {
    outputParts.push(outputPart);
}
exports.addOutputPart = addOutputPart;
function writeOutputPart(fileName) {
    (0, fs_1.writeFileSync)(fileName, outputParts.join('\n'), "utf-8");
}
exports.writeOutputPart = writeOutputPart;
