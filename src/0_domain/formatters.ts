export function formatNodeInformation(nodes: Record<string, any>, node: any, headline: string): String {
  let value = node[headline] // actually 'inboundWires'
  if (value === undefined) return '(undef)'
  if (value.length > 80) {
    value = String(value).replace(/(?:\r\n|\r|\n)/g, '<br/>')
    return ((new String(value)).slice(0, 20) + `..(Cropped. Length ${value.length})`)
  }
  switch (headline) {
    case 'tab':
      {
        const ioConnectNodes = nodes['ui_tab']
        const ioConnectNodeIndex = ioConnectNodes.findIndex((node: any) => node.id == value)
        if (ioConnectNodeIndex > -1) return ioConnectNodes[ioConnectNodeIndex].config.name;
        break;
      }
    case 'ioConnect': {
      const ioConnectNodes = nodes['ioConnect']
      const ioConnectNodeIndex = ioConnectNodes.findIndex((node: any) => node.id == value)
      if (ioConnectNodeIndex > -1) return ioConnectNodes[ioConnectNodeIndex].config.name;
      break;
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