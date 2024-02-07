export interface Td { content: string;  parentRowName: string, headline: string }
export interface Tr { tds: Td[]; }
export interface Thead { tds: {content: string}[];}
export interface Table { nodeType: string, head: Thead; trs: Tr[]; }