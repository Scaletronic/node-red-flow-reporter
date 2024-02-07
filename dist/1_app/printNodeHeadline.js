"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printNodeHeadline = exports.setOutputWriter = void 0;
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
 *
 * @param nodes Nodes to format
 * @param allNodes Array of all nodes, to use for look up of names
 */
function printNodeHeadline(nodes, allNodes) {
    if (fwObj === undefined)
        throw new Error("Please set the output writer");
    const fileWriteLine = fwObj.addOutputPart;
    const configHeadlines = (0, node_extractors_1.extractConfigHeaders)(nodes);
    const nodeHeadlines = ['name', ...configHeadlines, ...(0, node_extractors_1.extractHeaders)(nodes)];
    fileWriteLine(nodeHeadlines.map(units_1.prettyFromCamelCase).join(" | "));
    fileWriteLine(nodeHeadlines.map(a => '-----').join("|"));
    const sortedNodes = nodes.sort((a, b) => { var _a; return (_a = a.config['name']) === null || _a === void 0 ? void 0 : _a.localeCompare(b === null || b === void 0 ? void 0 : b.config['name']); });
    sortedNodes.forEach(node => {
        const maxColLengthByHeadline = (0, maxLengths_1.maxLengths)(nodeHeadlines, sortedNodes) || 3;
        const lineParts = [];
        nodeHeadlines.forEach(headline => {
            const maxColLength = maxColLengthByHeadline[headline] || 10;
            if (node[headline]) {
                const b = "bla".padStart(10, '.');
                let s = (0, formatters_1.formatNodeInformation)(allNodes, node, headline).toString();
                s.padStart(10);
                lineParts.push((0, formatters_1.formatNodeInformation)(allNodes, node, headline).toString().padStart(maxColLength));
            }
            else if (node.config[headline]) {
                lineParts.push((0, formatters_1.formatNodeInformation)(allNodes, node.config, headline).padStart(maxColLength));
            }
            else {
                lineParts.push('&nbsp;');
            }
        });
        fileWriteLine(lineParts.join(" | "));
    });
}
exports.printNodeHeadline = printNodeHeadline;
