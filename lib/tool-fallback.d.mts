export type RankedTool = {slug:string;title:string;subtitle:string;category:string;tags:string[];aliases:string[];formats:string;featured?:boolean};
export function suggestFallbackTools<T extends RankedTool>(query:string,catalog:T[],counts?:Record<string,number>,limit?:number):{tools:T[];label:string;source:string};
export function popularitySlugs(counts:Record<string,number>,available:string[]):string[];
