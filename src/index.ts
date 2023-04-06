#! /usr/bin/env node
const fs = require("fs");
const { parseFlow } = require("@node-red/flow-parser");
const FlowParser = require("@node-red/flow-parser");

import * as fw from "./2_infra/file-writer"
import { printNodeHeadline, setOutputWriter } from "./1_app/printNodeHeadline";

const fileWriteLine = fw.addOutputPart
setOutputWriter(fw)

let fileName: string = "";
if (process.argv.length <= 2) {
  console.error("No filename given as argument");
  process.exit(1)
} else if (process.argv.length > 2) {
  fileName = process.argv[2];
  console.log(`Filename given \n\t${fileName}`);
  console.log("File size " + fs.statSync(fileName).size)
}



// Load the flow json from a local file and parse to an object
// const exampleFlow = JSON.parse(fs.readFileSync("scripts-dev/flow-report-ts/test_data/test-01.json", "utf-8"));
const exampleFlow = JSON.parse(fs.readFileSync(fileName, "utf-8"));

fileWriteLine("# Flow Report")
fileWriteLine(`Filename: ${fileName}`)
fileWriteLine("")
const flow = parseFlow(exampleFlow);
type SimilarNodeList = any[]
type NodesType = Record<string, any>

const nodes: NodesType = []

flow.walk(function (obj: any) {
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
        nodes[obj.type] = []
      }
      nodes[obj.type].push(obj);
      break;
  }
})


function printNodes(nodes: NodesType): void {
  const nodeNames = Object.keys(nodes).sort((a, b) => a.localeCompare(b))
  nodeNames.forEach(nodeName => {
    fileWriteLine(`## Node type '${nodeName}' is used ${nodes[nodeName].length} times`)
    printNodeHeadline(nodes[nodeName])
    fileWriteLine("\n")
  })
}

printNodes(nodes)
const reportFileName  =`${fileName}.md`
fw.writeOutputPart(reportFileName)
console.log(`Wrote ${reportFileName} to disk`)