import { ExporterDef } from "../exporter.js";
import { LogRecord, AttributesMap } from "../logrecord.js"

function otlpExport(records:LogRecord[]):string {
    var encodedBatch = [];
    for (const record of records) {
        const encodedRecord = otlEncodeRecord(record);
        encodedBatch.push(encodedRecord);
    }
    return JSON.stringify(encodedBatch)
}

function otlEncodeRecord(record: LogRecord): any {
    return {
        "timestamp": record.Timestamp,
        "body": encodeValue(record.Body),
        "attributes": encodeAttrs(record.Attributes)
    }
}

function encodeAttrs(attributes?: AttributesMap): any {
    if (attributes===undefined) {
        return null
    }
    var attrList = [];
    for (const key in attributes) {
        attrList.push({
            "key": key,
            "value": encodeValue(attributes[key])
        });
    }
    return attrList
}

function encodeValue(val: any): any {
    switch (typeof val) {
        case "undefined":
            return undefined;
        case "string":
            return {"stringValue": val};
        case "number":
            return {"intValue": val};
        case "object":
            return encodeAttrs(val);
        default:
            throw "unknown type";
    }
}

export const OtlpExporter: ExporterDef ={
    name: "OTLP JSON",
    exportFunc: otlpExport,
};
