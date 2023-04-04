import { writeFileSync } from "fs";

const outputParts : String[] = []

export function addOutputPart(outputPart: string) {
  outputParts.push(outputPart)
}

export function writeOutputPart(fileName: string) {
  writeFileSync(fileName, outputParts.join('\n'),"utf-8")
}