

export interface OutputSubPart {
  names: string[];
  content: string;
}
export interface OutputWriter {
  addOutputPart: (outputPart: string) => void;
  writeOutputPart: (outputPart: string) => void;
  addSubPart: (outputPart: string, subpartNames: string[]) => void;
}
