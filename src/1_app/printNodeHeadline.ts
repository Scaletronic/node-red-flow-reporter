import { prettyFromCamelCase } from "../0_domain/units";
import { extractConfigHeaders, extractHeaders } from "../0_domain/node-extractors";
import { formatNodeInformation } from "../0_domain/formatters";
import { maxLengths } from "../0_domain/maxLengths";
import { OutputWriter } from "../0_domain/OutputWriter.interface";
import { NodesType } from "..";

let fwObj: OutputWriter | undefined = undefined; 

export function setOutputWriter(fw: OutputWriter) {
  fwObj = fw  
}
/**
 * 
 * @param nodes Nodes to format
 * @param allNodes Array of all nodes, to use for look up of names
 */
export function printNodeHeadline(nodes: any[], allNodes: NodesType): void {
  if (fwObj === undefined) throw new Error("Please set the output writer")
  const fileWriteLine = fwObj.addOutputPart
  const configHeadlines = extractConfigHeaders(nodes) as string[];
  const nodeHeadlines = ['name', ...configHeadlines, ...extractHeaders(nodes) as string[]];
  fileWriteLine(nodeHeadlines.map(prettyFromCamelCase).join(" | "));
  fileWriteLine(nodeHeadlines.map(a => '-----').join("|"));
  const sortedNodes = nodes.sort((a, b) =>  a.config['name']?.localeCompare(b?.config['name']));
  sortedNodes.forEach(node => {
    const maxColLengthByHeadline = maxLengths(nodeHeadlines, sortedNodes) || 3;
    const lineParts: string[] = [];
    nodeHeadlines.forEach(headline => {
      const maxColLength = maxColLengthByHeadline[headline] || 10;
      if (node[headline]) {
        const b = "bla".padStart(10, '.');
        let s: String = formatNodeInformation(allNodes, node, headline).toString();
        s.padStart(10);
        lineParts.push(formatNodeInformation(allNodes, node, headline).toString().padStart(maxColLength));
      } else if (node.config[headline]) {
        lineParts.push(formatNodeInformation(allNodes, node.config, headline).padStart(maxColLength));
      } else {
        lineParts.push('&nbsp;');
      }
    });
    fileWriteLine(lineParts.join(" | "));
  });
}
