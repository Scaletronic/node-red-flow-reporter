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
const commander_1 = require("commander");
const fs = require("fs");
const { parseFlow } = require("@node-red/flow-parser");
const FlowParser = require("@node-red/flow-parser");
const packageJson = __importStar(require("./2_infra/version.info"));
const fw = __importStar(require("./2_infra/file-writer"));
const printNodeHeadline_1 = require("./1_app/printNodeHeadline");
const fileWriteLine = fw.addOutputPart;
(0, printNodeHeadline_1.setOutputWriter)(fw);
console.log(packageJson.name, packageJson.version);
console.log(` - ${packageJson.description}`);
commander_1.program
    .description(packageJson.name)
    .name('node-red-flow-reporter')
    .version(packageJson.version)
    //.version(packageJson.version, '-v, --version', 'output the current version')
    .argument('<file>', 'input file name')
    //.option('-V', '--setVersion <type>', '1')
    // .addOption(new Option('-f, --file <type>', 'input file name'))
    //.option('-f, --file <type>', 'input file name')
    .parse(process.argv);
const args = commander_1.program.args;
// console.log("args", args);
let fileName = "";
// let setVersion: string = "";
// if (options.V) {
//   if (options.V === true) setVersion = "2";
//   else setVersion = options.V.toString();
//   console.log(`Version set to \n\t${setVersion}`);
// }
if (args.length > 0) {
    fileName = args[0];
    console.log(`Filename given \n\t${fileName}`);
    console.log("File size \n\t" + fs.statSync(fileName).size);
}
else {
    console.error("No filename given as argument");
    process.exit(1);
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
    // console.log("setVersion", setVersion)
    const nodeNames = Object.keys(nodes).sort((a, b) => a.localeCompare(b));
    nodeNames.forEach(nodeName => {
        fileWriteLine(`## Node type '${nodeName}' is used ${nodes[nodeName].length} times`);
        // if(setVersion === "1"){
        //   printNodeHeadline(nodes[nodeName], nodes)
        // } else if (setVersion === "2" )
        {
            (0, printNodeHeadline_1.printNodeHeadlineNewMarkdown)(nodes[nodeName], nodes);
        }
        // else {
        //   printNodeHeadline(nodes[nodeName], nodes)
        // }
        fileWriteLine("\n");
    });
}
printNodes(nodes);
const reportFileName = `${fileName}.md`;
fw.writeOutputPart(reportFileName);
console.log(`Wrote \n\t${reportFileName} to disk`);
