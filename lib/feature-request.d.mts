/** Types for the runtime .mjs utility; client-only sessionStorage transport. */
export const FEATURE_REQUEST_STORAGE_KEY: string;
export type FeatureStorage = Pick<Storage,"getItem"|"setItem"|"removeItem">;
export function isFeatureRequestCandidate(input:string):boolean;
export function featureRequestSubject(input:string):string;
export function featureRequestMessage(input:string):string;
export function savePendingFeatureRequest(storage:FeatureStorage,input:string,now?:number):boolean;
export function readPendingFeatureRequest(storage:FeatureStorage,now?:number):{query:string;savedAt:number}|null;
export function clearPendingFeatureRequest(storage:FeatureStorage):void;
