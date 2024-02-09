"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNodeInformation = void 0;
function formatNodeInformation(nodes, node, headline, allNodes) {
    var _a;
    let value = node[headline];
    if (value === undefined)
        return '(undef)';
    switch (headline) {
        case 'group': {
            return (((_a = value.config) === null || _a === void 0 ? void 0 : _a.name) ? value.config.name : 'Anonymous Group ' + value.id);
        }
        case 'ui_tab':
        case 'ioConnect':
            {
                const otherTypeNodes = allNodes[headline];
                if (otherTypeNodes === undefined)
                    return 'Bad reference: ' + JSON.stringify(value, undefined, "");
                const otherTypeNodeIndex = otherTypeNodes.findIndex((node) => node.id == value);
                if (otherTypeNodeIndex > -1)
                    return otherTypeNodes[otherTypeNodeIndex].config.name;
                return 'Not found';
            }
        case 'outboundWires': {
            if (value.length == 0)
                return value;
            const wire1 = value.pop();
            const destination = wire1.destinationNode;
            return `${destination.type}: ${destination.config.name} `;
        }
        case 'inboundWires': {
            if (value.length == 0)
                return value;
            const wire1 = value.pop();
            const source = wire1.sourceNode;
            return `${source.type}: ${source.config.name} `;
        }
        case 'theme':
        case 'site':
        case 'func':
        case 'props': {
            const jsonStr = JSON.stringify(value, undefined, " ");
            if (jsonStr) {
                return (new String(jsonStr)).replaceAll('\n', '<br/>');
            }
            return jsonStr;
        }
    }
    if (typeof value === 'object') {
        try {
            return JSON.stringify(value);
        }
        catch (e) {
            throw new Error("Error" + JSON.stringify(Object.assign({}, value)));
        }
    }
    return String(value);
}
exports.formatNodeInformation = formatNodeInformation;
