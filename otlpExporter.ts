import { LogRecord, AttributesMap } from "./logrecord.js"

function otlpExport(records:LogRecord[]):string {
    var encodedBatch = [];
    for (const record of records) {
        var encodedRecord = otlEncodeRecord(record);
        encodedBatch.push(encodedRecord);
    }
    return JSON.stringify(encodedRecord)
}

function otlEncodeRecord(record: LogRecord): any {
    return {
        "body": record.Body,
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
}

function encodeValue(val: any): any {
    switch (typeof val) {
        case "string":
            return {"stringValue": val};
        default:
            throw "unknown type";
    }
}