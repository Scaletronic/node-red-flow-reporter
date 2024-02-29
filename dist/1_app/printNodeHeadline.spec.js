"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const printNodeHeadline_1 = require("./printNodeHeadline");
let lines = [];
let fwOutput = "";
const fakeFileWriter = {
    addOutputPart(outputPart) {
        lines.push(outputPart);
    },
    writeOutputPart(reportFileName) {
        fwOutput = lines.join("\n");
        //    return lines.join('\n')
    },
    addSubPart(outputPart, subpartNames) {
        throw new Error("Method not implemented.");
    }
};
const fw = fakeFileWriter;
const fileWriteLine = fw.addOutputPart;
(0, printNodeHeadline_1.setOutputWriter)(fw);
let nodes = [];
let a = [];
function generateConfigObj(name) {
    let config = [];
    config["name"] = name;
    config["otherInfo"] = 'other ' + name;
    config["something head"] = "something";
    return config;
}
const parsedNRNode = {
    id: '47e7261b12eaf02d',
    z: 'be047adf.efd448',
    type: 'dwsInject',
    disabled: false,
    config: {
        name: 'S09 trigger cycle',
        messageType: 'trigger/sensorCycle',
        delayBetweenMessages: '',
        howManyToWakeup: '',
        pkgId: '',
        stopReason: '',
        sensorName: 'S09',
        source: 'S09',
        newPkgSource: 'Scan1',
        newPkgBarcodeEnabled: true,
        newPkgBarcode1: '123456',
        newPkgBarcode2: '',
        newPkgBarcode3: '',
        newPkgBarcodeDelay: '',
        newPkgBarcodeError: '',
        newPkgDimensionsEnabled: true,
        newPkgDimensionsDelay: '',
        newPkgDimensionsWarning: '',
        newPkgDimensionsError: '',
        newPkgDimensionsHeight: '200',
        newPkgDimensionsLength: '350',
        newPkgDimensionsWidth: '200',
        newPkgSortedEnabled: true,
        newPkgSortedDelay: '',
        newPkgSortedDropReason: '',
        newPkgSortedLane: '1',
        newPkgWeightEnabled: true,
        newPkgWeight: '1500',
        newPkgWeightDelay: '',
        newPkgWeightWarning: '',
        newPkgWeightError: '',
        outputs: 1
    },
    parent: {
        id: 'be047adf.efd448',
    },
    //TYPE: Symbol(NRNode),
    x: 210,
    y: 460,
    groupId: undefined,
    showLabel: true,
    inputLabels: [],
    outputLabels: [],
    wires: [[Array]],
    outputCount: 1,
    info: undefined,
    inboundWires: [],
    outboundWires: [[]] // NR WIRE
};
describe("Format a table ", () => {
    it("Outer Test", () => {
        const testNodes = [
            { type: "TestNode", id: '12345678', config: generateConfigObj("B1") },
            { type: "TestNode", id: "40868118", config: generateConfigObj("B2") }
        ];
        let nodes = { "TestNodes": testNodes };
        //console.log("nodes", nodes)
        const nodeNames = Object.keys(nodes).sort((a, b) => a.localeCompare(b));
        nodeNames.forEach(nodeName => {
            fileWriteLine(`## Node type '${nodeName}' is used ${nodes[nodeName].length} times`);
            //console.log("nodes.nodename",nodes[nodeName])
            (0, printNodeHeadline_1.printNodeHeadline)(nodes[nodeName], nodes);
            fileWriteLine("\n");
        });
        const output = fw.writeOutputPart("test");
        // expect(output).to.eq("Bla")
    });
    it("printNodeHeadline - simple", () => {
        lines = [];
        const testNodes = [
            { type: "TestNode", name: "N1", config: generateConfigObj("B1") },
            { type: "TestNode", name: "N2-40868118-123456", config: generateConfigObj("B2ABCDEFGHIJKLMN") }
        ];
        (0, printNodeHeadline_1.printNodeHeadline)(testNodes, nodes);
        fw.writeOutputPart("test");
        const col1Rows = fwOutput.split("\n").map(row => row.split("|")[0]);
        const col1RowsLengths = col1Rows.map(cell => cell.length);
        const shortestCellContent = Math.min(...col1RowsLengths);
        const longestCellContent = Math.max(...col1RowsLengths);
        //expect(shortestCellContent).to.eq(longestCellContent,`Lengths was ${col1RowsLengths.join(',')} `)
        // expect(output).to.eq("bla")
    });
});
describe("NodeRed Nodes to Table", () => {
    const testNodes = [
        { type: "TestNode", id: "123", name: "Node1", config: generateConfigObj("Node1Con") },
        { type: "TestNode", id: "234", name: "Node2", config: generateConfigObj("Node2Con") }
    ];
    // console.log("Test Nodes 1", testNodes[0])
    it("should create a table", () => {
        //TODO: DO NOT SORT the configs -
        //REASON: The order of the columns is important, since adding a column should be posible
        // ASK Jacob? Ask the team? 
        const expectedTableHead = {
            tds: [{ content: "name" }, { content: "id" }, { content: "otherInfo" }, { content: "something head" }]
        };
        const expectedTableBody = [
            {
                tds: [
                    { content: "Node1", headline: "name", parentRowName: "Node1" },
                    { content: "123", headline: "id", parentRowName: "Node1" },
                    { content: "other Node1Con", headline: "otherInfo", parentRowName: "Node1" },
                    { content: "something", headline: "something head", parentRowName: "Node1" }
                ]
            },
            {
                tds: [
                    { content: "Node2", headline: "name", parentRowName: "Node2" },
                    { content: "234", headline: "id", parentRowName: "Node2" },
                    { content: "other Node2Con", headline: "otherInfo", parentRowName: "Node2" },
                    { content: "something", headline: "something head", parentRowName: "Node2" }
                ]
            }
        ];
        console.log("Test Nodes 2", testNodes);
        const expectedTable = { nodeType: "TestNode", head: expectedTableHead, trs: expectedTableBody };
        const actualTable = (0, printNodeHeadline_1.nodesToTable)(testNodes, testNodes);
        const actualTableHead = actualTable.head;
        console.log("expectedTableHead", expectedTableHead);
        console.log("actualTableHead", actualTableHead);
        (0, chai_1.expect)(actualTableHead).to.deep.eq(expectedTableHead);
        (0, chai_1.expect)(actualTable).to.deep.eq(expectedTable);
    });
});
describe("Text to MD", () => {
    const tableHead = {
        tds: [
            { content: "HA" },
            { content: "HBBB" },
            { content: "HCCC" }
        ]
    };
    const tableBody = [
        { tds: [
                { content: "A", headline: "Test", parentRowName: "Test" },
                { content: "BB", headline: "Test", parentRowName: "Test" },
                { content: "CCC", headline: "Test", parentRowName: "Test" }
            ] },
        { tds: [
                { content: "AA", headline: "Test", parentRowName: "Test" },
                { content: "B", headline: "Test", parentRowName: "Test" },
                { content: "CCC", headline: "Test", parentRowName: "Test" }
            ] },
        { tds: [
                { content: "AAA", headline: "Test", parentRowName: "Test" },
                { content: "BBB", headline: "Test", parentRowName: "Test" },
                { content: "C", headline: "Test", parentRowName: "Test" }
            ] }
    ];
    const table = { head: tableHead, trs: tableBody, nodeType: "TestNode" };
    it("should create same space", () => {
        const markdownTable = (0, printNodeHeadline_1.tableToMarkdown)(table);
        const expectedMarkdown = `|HA  | HBBB | HCCC
|----|------|-----
|A   | BB   | CCC 
|AA  | B    | CCC 
|AAA | BBB  | C   `;
        (0, chai_1.expect)(markdownTable).to.eq(expectedMarkdown);
    });
});
