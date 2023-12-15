import { LogRecord } from "./logrecord.js"

export type ExporterDef = {
    name: string,
    exportFunc: (records:LogRecord[])=>string
}
