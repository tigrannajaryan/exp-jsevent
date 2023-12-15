import { ExporterDef } from "./exporter.js";
import { DictExporter } from "./exporters/dictExporter.js";
import { OtlpExporter } from "./exporters/otlpExporter.js";
import {  LogRecord, AttributesMap } from "./logrecord.js"

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

type generatorFunc = (name: string, fieldCount: number)=>LogRecord;

function generateEvents(generator: generatorFunc): void {
    recordEvent(generator("browser.page_view",4));
    recordEvent(generator("browser.page_navigation_timing",21));
    recordEvent(generator("browser.web_vitals",15));
    for (var i=0; i<6; i++) {
        recordEvent(generator("browser.http_request",6));
    }
    for (var i=0; i<112; i++) {
        recordEvent(generator("browser.resource_timing",20));
    }
    exportBatch();
}

function testNestedEvents() {
    console.log("Generating nested events");
    generateEvents(createNestedEvent);
}

function testFlatEvents() {
    console.log("Generating flattened events");
    generateEvents(createFlatEvent);
}

function onLoad() {
    testFlatEvents();
    testNestedEvents();
}

var batch: LogRecord[] = [];
var exporters: ExporterDef[] = [DictExporter, OtlpExporter];

function recordEvent(e: LogRecord) {
    batch.push(e);
}

function exportBatch() {
    console.log("Exporting",batch.length,"events...");

    var start = performance.now();
    const jsOrig = JSON.stringify(batch)
    var end = performance.now();
    const origStringifyMS = end-start;

    console.log(`Original JSON len: ${jsOrig.length} bytes, JSON.stringify ${origStringifyMS.toFixed(3)}ms`);

    for (const exporterDef of exporters) {
        start = performance.now();
        const jsEncoded = exporterDef.exportFunc(batch);
        const exportMS = performance.now()-end;
        console.log(`Encoded with ${exporterDef.name}, JSON len: ${jsEncoded.length} bytes, Encoding and JSON.stringify time: ${exportMS.toFixed(3)} ms`);
    }

    batch = [];

    // console.log(
    //     "Original JSON:",jsOrig,
    //     "Encoded JSON:",jsEncoded
    // );
}

onLoad()
