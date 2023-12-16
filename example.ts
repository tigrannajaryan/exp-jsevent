import { ExporterDef } from "./exporter.js";
import { DictExporter } from "./exporters/dictExporter.js";
import { OtlpExporter } from "./exporters/otlpExporter.js";
import {  LogRecord, AttributesMap } from "./logrecord.js"
import { addRow, beginTable, log } from "./report.js";

function createFlatEvent(name: string, fieldCount: number): LogRecord {
    const attrs:AttributesMap = {"event.name": name}
    for (var i=0; i<fieldCount; i++) {
        attrs[name+".attr"+i] = i;
    }
    var e: LogRecord = {Attributes:attrs};
    return e;
}

function createNestedEvent(name: string, fieldCount: number): LogRecord {
    var payload:any = {};
    const attrs:AttributesMap = {"event.name": name};
    for (var i=0; i<fieldCount; i++) {
        payload["attr"+i] = i;
    }
    var e: LogRecord = {Attributes:attrs, Body: payload};
    return e;
}

type DataModel = {
    name: string;
    generate: (name: string, fieldCount: number)=>LogRecord;
}

//type generatorFunc = (name: string, fieldCount: number)=>LogRecord;

function generateEvents(generator: DataModel): void {
    beginTable(generator.name, ["Encoding", "Wire size (bytes)", "Encoding duration (ms)"]);

    recordEvent(generator.generate("browser.page_view",4));
    recordEvent(generator.generate("browser.page_navigation_timing",21));
    recordEvent(generator.generate("browser.web_vitals",15));
    for (var i=0; i<6; i++) {
        recordEvent(generator.generate("browser.http_request",6));
    }
    for (var i=0; i<112; i++) {
        recordEvent(generator.generate("browser.resource_timing",20));
    }
    exportBatch();
}

function testNestedEvents() {
    generateEvents({name:"Nested in Body, no namespaces", generate:createNestedEvent});
}

function testFlatEvents() {
    generateEvents({name:"Flattened in Attributes, with namespaces", generate:createFlatEvent});
}

var batch: LogRecord[] = [];
var exporters: ExporterDef[] = [OtlpExporter, DictExporter];

function recordEvent(e: LogRecord) {
    e.Timestamp = 1702747793*1000000000;
    batch.push(e);
}

function exportBatch() {
    log("Exported",batch.length,"events.");

    var start = performance.now();
    const jsOrig = JSON.stringify(batch)
    var end = performance.now();
    const origStringifyMS = end-start;

    addRow(["JSON.stringify as-is", jsOrig.length, origStringifyMS.toFixed(3)]);

    for (const exporterDef of exporters) {
        start = performance.now();
        const jsEncoded = exporterDef.exportFunc(batch);
        const exportMS = performance.now()-end;
        addRow([exporterDef.name, jsEncoded.length, exportMS.toFixed(3)]);
    }

    batch = [];

    // console.log(
    //     "Original JSON:",jsOrig,
    //     "Encoded JSON:",jsEncoded
    // );
}

function onLoad() {
    testFlatEvents();
    testNestedEvents();
}

window.addEventListener("load", (event) => {
    onLoad();
});
