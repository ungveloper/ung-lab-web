export const RECENT_TOOLS_KEY: string;
export const RECENT_TOOLS_EVENT: string;
export const TOOL_RETURN_KEY: string;
export const MAX_RECENT_TOOLS: number;
export function parseRecentTools(raw: string | null, allowed: Set<string>): string[];
export function updateRecentTools(current: string[], slug: string, allowed: Set<string>): string[];
export function safeReturnTarget(slug: string, target: string): string | null;
export function saveToolReturn(slug: string, target: string): void;
export function readToolReturn(slug: string): string;
