import { OutputWriter } from "./OutputWriter.interface";

export function formatNodeInformation(nodes: Record<string, any>, node: any, headline: string, allNodes: Record<string, any>): String {
  let value = node[headline] 
  if (value === undefined) return '(undef)'

  switch (headline) {
    case 'group': {
      return (value.config.name ? value.config.name : 'Anonymous Group ' + value.id);
    }
    case 'ui_tab':
    case 'ioConnect':       
      {
        const otherTypeNodes = allNodes[headline]
        if(otherTypeNodes === undefined) return 'Bad reference: ' + JSON.stringify(value,undefined,"&nbsp;")
        const otherTypeNodeIndex = otherTypeNodes.findIndex((node: any) => node.id == value)
        if (otherTypeNodeIndex > -1) return otherTypeNodes[otherTypeNodeIndex].config.name;
        return 'Not found';
      }
    case 'outboundWires': {
      if (value.length == 0) return value
      const wire1 = value.pop()
      const destination = wire1.destinationNode
      return `${destination.type}: ${destination.config.name} `
    }
    case 'inboundWires': {
      if (value.length == 0) return value
      const wire1 = value.pop()
      const source = wire1.sourceNode
      return `${source.type}: ${source.config.name} `
    }
    case 'theme':
    case 'site': 
    case 'func':
    case 'props': {
      const jsonStr = JSON.stringify(value,undefined," ")
      if (jsonStr) {
        return (new String(jsonStr)).replaceAll('\n','<br/>')
      }
      return jsonStr
    }
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    }
    catch (e) {
      throw new Error("Error" + JSON.stringify({ ...value }))
    }
  }
  return String(value);
}
