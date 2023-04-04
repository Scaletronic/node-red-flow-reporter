"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractConfigHeaders = exports.extractHeaders = void 0;
function extractHeaders(similarNodes) {
    if (similarNodes === undefined || similarNodes.length === 0)
        return [];
    const firstNode = similarNodes[0];
    const keys = Object.keys(firstNode);
    const irrelevantKeys = ['x', 'y', 'z', 'type', 'TYPE', 'groupId', 'showLabel', 'wires', 'config', 'parent']; // we dont care about positions on the map
    const relevantKeys = keys.filter(key => !irrelevantKeys.includes(key));
    return relevantKeys;
}
exports.extractHeaders = extractHeaders;
function extractConfigHeaders(similarConfig) {
    if (similarConfig === undefined || similarConfig.length === 0)
        return [];
    const firstNode = similarConfig[0];
    const keys = Object.keys(firstNode.config);
    const irrelevantKeys = ['name', 'x', 'y', 'z', 'type', 'TYPE', 'showLabel', 'wires', 'statusBroker']; // we dont care about positions on the map
    const relevantKeys = keys.filter(key => !irrelevantKeys.includes(key));
    return relevantKeys;
}
exports.extractConfigHeaders = extractConfigHeaders;
