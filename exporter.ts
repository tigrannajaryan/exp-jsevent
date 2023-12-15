import { LogRecord, AttributesMap } from "./logrecord.js"

export type ExporterDef = {
    name: string,
    exportFunc: (records:LogRecord[])=>string
}

function otlpExport(records:LogRecord[]):string {
    return ""
}

type DictType = { strings: {[key:string]:any}, len: number }

function dictExport(records:LogRecord[]):string {
    var dict:DictType = {strings:{}, len:0}    ;
    var encodedBatch = [];
    for (const record of records) {
        var encodedRecord = encodeObject(record, dict);
        encodedBatch.push(encodedRecord);
    }
    const exportData = {r: encodedBatch, d: encodeDict(dict)};
    
    //console.log("Unencoded export data", batch)
    //console.log("Encoded export data", exportData)

    const jsEncoded = JSON.stringify(exportData)
    return jsEncoded
}

function encodeObject(obj:any, dict:DictType) {
    var encoded:any = {};
    for (const key in obj) {
        const keyRef = encodeVal(key,dict);

        var val = obj[key]

        if (typeof val == "object") {
            val = encodeObject(val, dict);
        }

        encoded[keyRef] = val;
    }
    return encoded;
}

function encodeVal(val:any, dict:DictType):any {
    var ref: number;
    if (val in dict.strings) {
        ref = dict.strings[val];
    } else {
        dict.len++;
        ref = dict.len;
        dict.strings[val] = ref;
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
    name: "Dict",
    exportFunc: dictExport,
};
