export type PromptRow = {slug:string;question:string;is_default?:boolean;display_order?:number;question_count?:number};
export const DEFAULT_PROMPTS:PromptRow[];
export function choosePromptQuestions(rows:PromptRow[],limit?:number):string[];
