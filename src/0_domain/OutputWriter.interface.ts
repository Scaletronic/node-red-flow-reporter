
export interface OutputWriter {
  addOutputPart: (outputPart: string) => void;
  writeOutputPart: (outputPart: string) => void;
}
