import { prettyFromCamelCase } from "../0_domain/units";
import { extractConfigHeaders, extractHeaders } from "../0_domain/node-extractors";
import { formatNodeInformation } from "../0_domain/formatters";
import { maxLengths } from "../0_domain/maxLengths";
import { OutputSubPart, OutputWriter } from "../0_domain/OutputWriter.interface";
import { NodesType } from "../0_domain/NodesType";
import { Table, Td, Thead, Tr } from "../0_domain/Table.interface";

let fwObj: OutputWriter | undefined = undefined;

export function setOutputWriter(fw: OutputWriter) {
  fwObj = fw
}
/**
 * @deprecated
 * @param nodes Nodes to format
 * @param allNodes Array of all nodes, to use for look up of names
 */
export function printNodeHeadline(nodes: any[], allNodes: NodesType): void {
  console.log("printNodeHeadline - old code - to be replaced when V2 is the standard")
  if (fwObj === undefined) throw new Error("Please set the output writer")
  const fileWriteLine = fwObj.addOutputPart
  const configHeadlines = extractConfigHeaders(nodes) as string[];
  const nodeHeadlines = ['name', 'id', ...configHeadlines, ...extractHeaders(nodes) as string[]];
  fileWriteLine(nodeHeadlines.map(prettyFromCamelCase).join(" | "));
  fileWriteLine(nodeHeadlines.map(a => '-----').join("|"));
  const sortedNodes = nodes.sort((a, b) => a.config['name'] && a.config['name'].localeCompare(b.config['name']));
  sortedNodes.forEach(node => {
    const maxColLengthByHeadline = maxLengths(nodeHeadlines, sortedNodes) || 3;
    const cellContentForRow: string[] = [];
    nodeHeadlines.forEach(headline => {
      const maxColLength = maxColLengthByHeadline[headline] || 10;
      if (node[headline]) {
        let s: String = formatNodeInformation(nodes, node, headline, allNodes).toString();
        s.padStart(10);
        cellContentForRow.push(formatNodeInformation(nodes, node, headline, allNodes).toString().padStart(maxColLength));
      } else if (node.config[headline]) {
        cellContentForRow.push(formatNodeInformation(nodes, node.config, headline, allNodes).padStart(maxColLength));
      } else {
        cellContentForRow.push('');
      }
    });
    fileWriteLine(cellContentForRow.join(" | ").trim());
  });
}


interface tableAndSubParts {
  table: Table;
  subParts: OutputSubPart[];
}

function TdContentToString(td: Td): Td {
  const contentType = typeof td.content
  let contentAsString = ""
  switch (contentType) {
    case "string": contentAsString = td.content.toString(); break;
    case "number": contentAsString = td.content.toString(); break;
    case "object": contentAsString = JSON.stringify(td.content); break;
    default: throw new Error(`Unknown type ${contentType}` + td.headline + td.parentRowName)
  }
  if (contentAsString.length == 0) contentAsString = ''
  //throw new Error("Empty content:" + td.content + ":" + td.headline + td.parentRow.tds[0].content)  
  return { ...td, content: contentAsString }
}

export function guessFileTypeByContent(content: string): string {
  if (content.startsWith('#')) return 'md'
  if (content.startsWith('<')) return 'html'
  if (content.startsWith('[') && content.endsWith(']')) return 'json'
  if (content.startsWith('{') && content.endsWith('}')) return 'json'
  return 'txt'
}

export function tableFilterOutCropAndSaveToSubParts(table: Table): tableAndSubParts {
  const subParts: OutputSubPart[] = []
  const tableWithSubParts: tableAndSubParts = { table: table, subParts: [] }
  table.trs.forEach(tr => tr.tds.forEach((td) => {
    if (td.content.length > 100) {
      // Remove whitespace and replace with underscore
      const fileName = table.nodeType + '-' + td.headline + '_' + td.parentRowName.replace(/\s/g, '_') + '.' + guessFileTypeByContent(td.content)
      const subPart: OutputSubPart = { names: [fileName], content: td.content.toString() }
      subParts.push(subPart)
      td.content = 'To long, moved to file' + fileName
    }
  }))
  tableWithSubParts.subParts = subParts
  return tableWithSubParts
}

export function printNodeHeadlineNewMarkdown(nodes: any[], allNodes: NodesType) {
  if (fwObj === undefined) throw new Error("Please set the output writer")
  const fileWriteLine = fwObj.addOutputPart
  const nodeTable = nodesToTable(nodes, allNodes)
  const nodeTableWithStrings: Table = {
    nodeType: nodes[0].type,
    head: nodeTable.head, trs: nodeTable.trs.map(tr => ({ tds: tr.tds.map(TdContentToString) }))
  };
  const nodeTableWithSubParts = tableFilterOutCropAndSaveToSubParts(nodeTableWithStrings);
  const tableMarkdown = tableToMarkdown(nodeTableWithSubParts.table)
  fileWriteLine(tableMarkdown)
  nodeTableWithSubParts.subParts.forEach(subPart => fwObj?.addSubPart(subPart.content, subPart.names))
}

/** @deprecated 
 * this function is used in the old code, but it is not used in the new code
*/
export function arrayOfCellsToMarkdownRow(cells: string[]) {
  console.log("deprecated function called")
  const maxLength = Math.max(...cells.map(cell => cell.length))
  const cellsPadded = cells.map(cell => cell.padStart(maxLength, " "));
  return cellsPadded.join(" | ")
}


export function nodeName(node: any): string {
  return node.config.name || node.id
}


export function nodesToTable(nodes: any[], allNodes: NodesType): Table {
  const configHeadlines = extractConfigHeaders(nodes) as string[];
  const nodeHeadlines = ['name', 'id', ...configHeadlines, ...extractHeaders(nodes) as string[]];
  const tableHead: Thead = { tds: nodeHeadlines.map(headline => ({ content: headline })) }
  /** Sort the nodes / rows in the table */
  const sortedNodes = nodes.sort((a, b) => nodeName(a).localeCompare(nodeName(b)))
  const tableBody: Tr[] = sortedNodes.map(node => {
    const row: Tr = { tds: [] }
    nodeHeadlines.forEach(headline => {
      let td = { content: "", parentRowName: "", headline: "" }
      let _content = ""
      if (node[headline]) {
        td.content = formatNodeInformation(nodes, node, headline, allNodes).toString()
      } else if (node.config[headline]) {
        td.content = formatNodeInformation(nodes, node.config, headline, allNodes).toString()
      } else {
        _content = ''
      }
      td.headline = headline
      if (headline == 'name') td.parentRowName = td.content
      else td.parentRowName = row.tds[0]?.content || row.tds[1]?.content
      row.tds.push(td)
    })
    return row
  })
  return { nodeType: nodes[0].type, head: tableHead, trs: tableBody }
}

export function tableToMarkdown(table: Table): string {
  const firstLength = Math.max(table.head.tds[0].content.length
    , ...table.trs.map(tr => tr.tds[0].content.length))
  const allLengthsByColumn = table.head.tds.map(td => td.content.length)
  table.trs.forEach(tr => {
    tr.tds.forEach((td, index) => {
      allLengthsByColumn[index] = Math.max(allLengthsByColumn[index], td.content.length)
    })
  })
  const tableHeadMarkdown = table.head.tds.map((td, index) => td.content.padEnd(allLengthsByColumn[index])).join(" | ")
  // replace all alphanumeric chars and whitespace with "-"
  const tableLine = tableHeadMarkdown.replace(/[\w\s]/g, "-")
  const tableBodyAsStrings = table.trs.map(tr => tr.tds.map((td, index) => {
    const contentType = typeof td.content
    let contentAsString = ""
    switch (contentType) {
      case "string": contentAsString = td.content.padEnd(allLengthsByColumn[index]); break;
      case "number": contentAsString = td.content.toString().padStart(allLengthsByColumn[index]); break;
      case "object": contentAsString = JSON.stringify(td.content).padEnd(allLengthsByColumn[index]); break;
      default: throw new Error(`Unknown type ${contentType}`)
    }
    if (contentAsString.length == 0) throw new Error("Empty content")
    return contentAsString
  }))
  const tableBodyMarkdown = tableBodyAsStrings.map(row => '|' + row.join(" | ")).join("\n")
  const tableMarkdown = `|${tableHeadMarkdown}\n|${tableLine}\n${tableBodyMarkdown}`
  return tableMarkdown
}