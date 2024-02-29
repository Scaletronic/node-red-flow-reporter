"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableToMarkdown = exports.nodesToTable = exports.nodeName = exports.arrayOfCellsToMarkdownRow = exports.printNodeHeadlineNewMarkdown = exports.tableFilterOutCropAndSaveToSubParts = exports.guessFileTypeByContent = exports.printNodeHeadline = exports.setOutputWriter = void 0;
const units_1 = require("../0_domain/units");
const node_extractors_1 = require("../0_domain/node-extractors");
const formatters_1 = require("../0_domain/formatters");
const maxLengths_1 = require("../0_domain/maxLengths");
let fwObj = undefined;
function setOutputWriter(fw) {
    fwObj = fw;
}
exports.setOutputWriter = setOutputWriter;
/**
 * @deprecated
 * @param nodes Nodes to format
 * @param allNodes Array of all nodes, to use for look up of names
 */
function printNodeHeadline(nodes, allNodes) {
    console.log("printNodeHeadline - old code - to be replaced when V2 is the standard");
    if (fwObj === undefined)
        throw new Error("Please set the output writer");
    const fileWriteLine = fwObj.addOutputPart;
    const configHeadlines = (0, node_extractors_1.extractConfigHeaders)(nodes);
    const nodeHeadlines = ['name', 'id', ...configHeadlines, ...(0, node_extractors_1.extractHeaders)(nodes)];
    fileWriteLine(nodeHeadlines.map(units_1.prettyFromCamelCase).join(" | "));
    fileWriteLine(nodeHeadlines.map(a => '-----').join("|"));
    const sortedNodes = nodes.sort((a, b) => a.config['name'] && a.config['name'].localeCompare(b.config['name']));
    sortedNodes.forEach(node => {
        const maxColLengthByHeadline = (0, maxLengths_1.maxLengths)(nodeHeadlines, sortedNodes) || 3;
        const cellContentForRow = [];
        nodeHeadlines.forEach(headline => {
            const maxColLength = maxColLengthByHeadline[headline] || 10;
            if (node[headline]) {
                let s = (0, formatters_1.formatNodeInformation)(nodes, node, headline, allNodes).toString();
                s.padStart(10);
                cellContentForRow.push((0, formatters_1.formatNodeInformation)(nodes, node, headline, allNodes).toString().padStart(maxColLength));
            }
            else if (node.config[headline]) {
                cellContentForRow.push((0, formatters_1.formatNodeInformation)(nodes, node.config, headline, allNodes).padStart(maxColLength));
            }
            else {
                cellContentForRow.push('');
            }
        });
        fileWriteLine(cellContentForRow.join(" | ").trim());
    });
}
exports.printNodeHeadline = printNodeHeadline;
function TdContentToString(td) {
    const contentType = typeof td.content;
    let contentAsString = "";
    switch (contentType) {
        case "string":
            contentAsString = td.content.toString();
            break;
        case "number":
            contentAsString = td.content.toString();
            break;
        case "object":
            contentAsString = JSON.stringify(td.content);
            break;
        default: throw new Error(`Unknown type ${contentType}` + td.headline + td.parentRowName);
    }
    if (contentAsString.length == 0)
        contentAsString = '';
    //throw new Error("Empty content:" + td.content + ":" + td.headline + td.parentRow.tds[0].content)  
    return Object.assign(Object.assign({}, td), { content: contentAsString });
}
function guessFileTypeByContent(content) {
    if (content.startsWith('#'))
        return 'md';
    if (content.startsWith('<'))
        return 'html';
    if (content.startsWith('[') && content.endsWith(']'))
        return 'json';
    if (content.startsWith('{') && content.endsWith('}'))
        return 'json';
    return 'txt';
}
exports.guessFileTypeByContent = guessFileTypeByContent;
function tableFilterOutCropAndSaveToSubParts(table) {
    const subParts = [];
    const tableWithSubParts = { table: table, subParts: [] };
    table.trs.forEach(tr => tr.tds.forEach((td) => {
        if (td.content.length > 100) {
            // Remove whitespace and replace with underscore
            const fileName = table.nodeType + '-' + td.headline + '_' + td.parentRowName.replace(/\s/g, '_') + '.' + guessFileTypeByContent(td.content);
            const subPart = { names: [fileName], content: td.content.toString() };
            subParts.push(subPart);
            td.content = 'To long, moved to file' + fileName;
        }
    }));
    tableWithSubParts.subParts = subParts;
    return tableWithSubParts;
}
exports.tableFilterOutCropAndSaveToSubParts = tableFilterOutCropAndSaveToSubParts;
function printNodeHeadlineNewMarkdown(nodes, allNodes) {
    if (fwObj === undefined)
        throw new Error("Please set the output writer");
    const fileWriteLine = fwObj.addOutputPart;
    const nodeTable = nodesToTable(nodes, allNodes);
    const nodeTableWithStrings = {
        nodeType: nodes[0].type,
        head: nodeTable.head, trs: nodeTable.trs.map(tr => ({ tds: tr.tds.map(TdContentToString) }))
    };
    const nodeTableWithSubParts = tableFilterOutCropAndSaveToSubParts(nodeTableWithStrings);
    const tableMarkdown = tableToMarkdown(nodeTableWithSubParts.table);
    fileWriteLine(tableMarkdown);
    nodeTableWithSubParts.subParts.forEach(subPart => fwObj === null || fwObj === void 0 ? void 0 : fwObj.addSubPart(subPart.content, subPart.names));
}
exports.printNodeHeadlineNewMarkdown = printNodeHeadlineNewMarkdown;
/** @deprecated
 * this function is used in the old code, but it is not used in the new code
*/
function arrayOfCellsToMarkdownRow(cells) {
    console.log("deprecated function called");
    const maxLength = Math.max(...cells.map(cell => cell.length));
    const cellsPadded = cells.map(cell => cell.padStart(maxLength, " "));
    return cellsPadded.join(" | ");
}
exports.arrayOfCellsToMarkdownRow = arrayOfCellsToMarkdownRow;
function nodeName(node) {
    return node.config.name || node.id;
}
exports.nodeName = nodeName;
function nodesToTable(nodes, allNodes) {
    const configHeadlines = (0, node_extractors_1.extractConfigHeaders)(nodes);
    const nodeHeadlines = ['name', 'id', ...configHeadlines, ...(0, node_extractors_1.extractHeaders)(nodes)];
    const tableHead = { tds: nodeHeadlines.map(headline => ({ content: headline })) };
    /** Sort the nodes / rows in the table */
    const sortedNodes = nodes.sort((a, b) => nodeName(a).localeCompare(nodeName(b)));
    const tableBody = sortedNodes.map(node => {
        const row = { tds: [] };
        nodeHeadlines.forEach(headline => {
            var _a, _b;
            let td = { content: "", parentRowName: "", headline: "" };
            let _content = "";
            if (node[headline]) {
                td.content = (0, formatters_1.formatNodeInformation)(nodes, node, headline, allNodes).toString();
            }
            else if (node.config[headline]) {
                td.content = (0, formatters_1.formatNodeInformation)(nodes, node.config, headline, allNodes).toString();
            }
            else {
                _content = '';
            }
            td.headline = headline;
            if (headline == 'name')
                td.parentRowName = td.content;
            else
                td.parentRowName = ((_a = row.tds[0]) === null || _a === void 0 ? void 0 : _a.content) || ((_b = row.tds[1]) === null || _b === void 0 ? void 0 : _b.content);
            row.tds.push(td);
        });
        return row;
    });
    return { nodeType: nodes[0].type, head: tableHead, trs: tableBody };
}
exports.nodesToTable = nodesToTable;
function tableToMarkdown(table) {
    const firstLength = Math.max(table.head.tds[0].content.length, ...table.trs.map(tr => tr.tds[0].content.length));
    const allLengthsByColumn = table.head.tds.map(td => td.content.length);
    table.trs.forEach(tr => {
        tr.tds.forEach((td, index) => {
            allLengthsByColumn[index] = Math.max(allLengthsByColumn[index], td.content.length);
        });
    });
    const tableHeadMarkdown = table.head.tds.map((td, index) => td.content.padEnd(allLengthsByColumn[index])).join(" | ");
    // replace all alphanumeric chars and whitespace with "-"
    const tableLine = tableHeadMarkdown.replace(/[\w\s]/g, "-");
    const tableBodyAsStrings = table.trs.map(tr => tr.tds.map((td, index) => {
        const contentType = typeof td.content;
        let contentAsString = "";
        switch (contentType) {
            case "string":
                contentAsString = td.content.padEnd(allLengthsByColumn[index]);
                break;
            case "number":
                contentAsString = td.content.toString().padStart(allLengthsByColumn[index]);
                break;
            case "object":
                contentAsString = JSON.stringify(td.content).padEnd(allLengthsByColumn[index]);
                break;
            default: throw new Error(`Unknown type ${contentType}`);
        }
        if (contentAsString.length == 0)
            throw new Error("Empty content");
        return contentAsString;
    }));
    const tableBodyMarkdown = tableBodyAsStrings.map(row => '|' + row.join(" | ")).join("\n");
    const tableMarkdown = `|${tableHeadMarkdown}\n|${tableLine}\n${tableBodyMarkdown}`;
    return tableMarkdown;
}
exports.tableToMarkdown = tableToMarkdown;
