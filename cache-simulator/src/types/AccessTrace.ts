import type { AccessResult } from "./AccessResult";

export interface AccessTrace {
    accessNumber: number;
    result: AccessResult;
}