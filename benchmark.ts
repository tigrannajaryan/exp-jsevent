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
    generateEvents({name:"Nested, in Body, no namespaces", generate:createNestedEvent});
}

function testFlatEvents() {
    generateEvents({name:"Flattened, in Attributes, with namespaces", generate:createFlatEvent});
}

var batch: LogRecord[] = [];
var exporters: ExporterDef[] = [OtlpExporter, DictExporter];

function recordEvent(e: LogRecord) {
    e.Timestamp = 1702747793*1000000000;
    batch.push(e);
}

type BenchmarkResult = {
    retValues: any[];
    durationMS: number;
}

function benchmark(func: Function): BenchmarkResult {
    const ITERATIONS = 10;
    const start = performance.now();
    var retValues = [];
    for (var i=0; i<ITERATIONS; i++) {
        const val = func();
        retValues.push(val);
    }
    const durationMS = performance.now()-start;
    return { retValues: retValues, durationMS: durationMS/ITERATIONS };
}

function exportBatch() {
    const { retValues: jsOrig, durationMS } = benchmark(()=>JSON.stringify(batch));
    addRow(["JSON.stringify as-is", jsOrig[0].length, durationMS.toFixed(1)]);

    for (const exporterDef of exporters) {
        const { retValues: jsEncoded, durationMS } = benchmark(()=>exporterDef.exportFunc(batch));
        addRow([exporterDef.name, jsEncoded[0].length, durationMS.toFixed(1)]);
    }

    log("Exported",batch.length,"events.");

    batch = [];
}

function onLoad() {
    testFlatEvents();
    testNestedEvents();
}

window.addEventListener("load", (event) => {
    onLoad();
});
