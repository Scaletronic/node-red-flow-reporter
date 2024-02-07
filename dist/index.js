#! /usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const { parseFlow } = require("@node-red/flow-parser");
const FlowParser = require("@node-red/flow-parser");
const fw = __importStar(require("./2_infra/file-writer"));
const printNodeHeadline_1 = require("./1_app/printNodeHeadline");
const fileWriteLine = fw.addOutputPart;
(0, printNodeHeadline_1.setOutputWriter)(fw);
let fileName = "";
if (process.argv.length <= 2) {
    console.error("No filename given as argument");
    process.exit(1);
}
else if (process.argv.length > 2) {
    fileName = process.argv[2];
    console.log(`Filename given \n\t${fileName}`);
    console.log("File size " + fs.statSync(fileName).size);
}
// Load the flow json from a local file and parse to an object
// const exampleFlow = JSON.parse(fs.readFileSync("scripts-dev/flow-report-ts/test_data/test-01.json", "utf-8"));
const exampleFlow = JSON.parse(fs.readFileSync(fileName, "utf-8"));
fileWriteLine("# Flow Report");
fileWriteLine(`Filename: ${fileName}`);
fileWriteLine("");
const flow = parseFlow(exampleFlow);
const nodes = [];
flow.walk(function (obj) {
    switch (obj.TYPE) {
        case FlowParser.types.Flow:
        // A flow object
        //break;
        case FlowParser.types.Subflow:
        // A subflow definition
        //break;
        case FlowParser.types.Group:
            // A group object
            break;
        case FlowParser.types.ConfigNode:
        // // A config node
        // break;
        case FlowParser.types.Node:
            // A flow node
            if (nodes[obj.type] == undefined) {
                nodes[obj.type] = [];
            }
            nodes[obj.type].push(obj);
            break;
    }
});
function printNodes(nodes) {
    const nodeNames = Object.keys(nodes).sort((a, b) => a.localeCompare(b));
    nodeNames.forEach(nodeName => {
        fileWriteLine(`## Node type '${nodeName}' is used ${nodes[nodeName].length} times`);
        (0, printNodeHeadline_1.printNodeHeadline)(nodes[nodeName], nodes);
        fileWriteLine("\n");
    });
}
printNodes(nodes);
const reportFileName = `${fileName}.md`;
fw.writeOutputPart(reportFileName);
console.log(`Wrote ${reportFileName} to disk`);
