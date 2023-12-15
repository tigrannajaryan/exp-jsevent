type AttributesMap = {[key:string]:any}

type LogRecord = {
    Timestamp?: number;
    Body?: any;
    Attributes?: AttributesMap
}