Execution output:

```
example.js:38 Generating flattened events
example.js:70 Exporting 121 events...
example.js:93 Original JSON len: 85896 bytes, Encoded JSON len: 23389 bytes
example.js:98 Encoding time: 1.6999998092651367 ms
example.js:33 Generating nested events
example.js:70 Exporting 121 events...
example.js:93 Original JSON len: 32550 bytes, Encoded JSON len: 21426 bytes
example.js:98 Encoding time: 1 ms
```

In original, non-encoded form the flattened events are 85896-32550 = 53346 bytes larger (85896/32550=2.64 times larger) than in nested form (both JSON encoded).

In dictionary-encoded form the flattened events are 23389-21426 = 1963 bytes larger (23389/21426=1.09 times larger) than in nested form (both JSON encoded).