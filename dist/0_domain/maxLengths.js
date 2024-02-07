"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxLengths = void 0;
function maxLengths(headlines, nodes) {
    const headlineLengthObj = {};
    const rows = nodes.length;
    headlines.forEach((headline) => {
        let maxHeadlineLength = 0;
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            let maxRowLength = 0;
            for (let j = 0; j < node.length; j++) {
                const cellLength = node[j].length;
                if (cellLength > maxRowLength) {
                    maxRowLength = cellLength;
                }
            }
            const rowLength = maxRowLength * (i + 1);
            if (rowLength > maxHeadlineLength) {
                maxHeadlineLength = rowLength;
            }
        }
        headlineLengthObj[headline] = (maxHeadlineLength > 40)
            ? 40 : maxHeadlineLength;
    });
    // const result = headLines.map(line => {
    //   const headlineLength = line.length;
    //   const nodeValuesLength = nodes
    //     .map(node => node[line] && node[line].length || node.config[line] && node.config[line].length || 0)
    //     .reduce((previousValue, currentValue) => Math.max(previousValue, currentValue))
    //   return Math.max(headlineLength, nodeValuesLength);
    // })
    // const recordset: Record<string,number> = []
    // for 
    return headlineLengthObj;
}
exports.maxLengths = maxLengths;
