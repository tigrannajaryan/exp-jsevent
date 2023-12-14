function createFlatEvent(name, fieldCount) {
    var e = {"event.name": name};
    for (var i=0; i<fieldCount; i++) {
        e[name+".attr"+i] = i;
    }
    return e;
}

function createNestedEvent(name, fieldCount) {
    var e = {"event.name": name};
    var payload = {};
    for (var i=0; i<fieldCount; i++) {
        payload["attr"+i] = i;
    }
    e["event.payload"] = payload;
    return e;
}

function generateEvents(generator) {
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

var batch = []

function recordEvent(e) {
    batch.push(e);
}

function exportBatch() {
    console.log("Exporting",batch.length,"events...");

    const start = performance.now();

    var dict = {strings:{}, len:0}    ;
    var encodedBatch = [];
    var origBatch = [];
    for (const record of batch) {
        var encodedRecord = encodeObject(record, dict);
        encodedBatch.push(encodedRecord);
        origBatch.push(record);
    }
    const exportData = {r: encodedBatch, d: encodeDict(dict)};
    
    //console.log("Unencoded export data", batch)
    //console.log("Encoded export data", exportData)

    const jsOrig = JSON.stringify(origBatch)
    const jsEncoded = JSON.stringify(exportData)

    batch = [];

    const end = performance.now();

    console.log(
        "Original JSON len:",jsOrig.length,"bytes,",
        "Encoded JSON len:",jsEncoded.length,"bytes"
    );

    console.log(`Encoding time: ${end - start} ms`);
}

function encodeObject(obj, dict) {
    var encoded = {};
    for (key in obj) {
        keyRef = encodeVal(key,dict);

        var val = obj[key]

        if (typeof val == "object") {
            val = encodeObject(val, dict);
        }

        encoded[keyRef] = val;
    }
    return encoded;
}

function encodeVal(val, dict) {
    if (val in dict.strings) {
        ref = dict.strings[val];
    } else {
        dict.len++;
        ref = dict.len;
        dict.strings[val] = ref;
    }
    return ref;
}

function encodeDict(dict) {
    var d = [];
    for (key in dict.strings) {
        ref = dict.strings[key];
        d[ref] = key;
    }
    return d;
}

onLoad()