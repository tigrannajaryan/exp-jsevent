export type AttributesMap = {[key:string]:any}

export type LogRecord = {
    Timestamp?: number;
    Body?: any;
    Attributes?: AttributesMap
}