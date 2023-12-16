import { ExporterDef } from "../exporter.js";
import { LogRecord } from "../logrecord.js"

type DictType = { strings: {[key:string]:any}, len: number }

function dictExport(records:LogRecord[]):string {
    var dict:DictType = {strings:{}, len:0}    ;
    var encodedBatch = [];
    for (const record of records) {
        var encodedRecord = encodeRecord(record, dict);
        encodedBatch.push(encodedRecord);
    }
    const exportData = {r: encodedBatch, d: encodeDict(dict)};
    
    //console.log("Unencoded export data", batch)
    //console.log("Encoded export data", exportData)

    const jsEncoded = JSON.stringify(exportData)
    return jsEncoded
}

function encodeRecord(record: LogRecord, dict:DictType): any {
    return {
        "t": record.Timestamp,
        "b": encodeObject(record.Body, dict),
        "a": encodeObject(record.Attributes, dict)
    }
}

function encodeObject(obj:any, dict:DictType) {
    if (obj===undefined) {
        return undefined;
    }

    var encoded:any = {};
    for (const key in obj) {
        const keyRef = encodeVal(key,dict);

        var val = obj[key]

        if (typeof val == "object") {
            val = encodeObject(val, dict);
        }

        encoded["@"+keyRef.toString(16)] = val;
    }
    return encoded;
}

function encodeVal(val:any, dict:DictType):any {
    var ref: number;
    if (val in dict.strings) {
        ref = dict.strings[val];
    } else {
        ref = dict.len;
        dict.strings[val] = ref;
        dict.len++;
    }
    return ref;
}

function encodeDict(dict:DictType):string[] {
    var d:string[] = [];
    for (const key in dict.strings) {
        const ref = dict.strings[key];
        d[ref] = key;
    }
    return d;
}

export const DictExporter: ExporterDef ={
    name: "OTLP with key dictionary",
    exportFunc: dictExport,
};
