## Run on desktop Chrome:

<body>
<h3>Flattened, in Attributes, with namespaces</h3><table><tr><th>Encoding</th><th>Wire size (bytes)</th><th>Encoding duration (ms)</th></tr><tr><td>JSON.stringify as-is</td><td>91583</td><td>0.4</td></tr><tr><td>OTLP JSON</td><td>162619</td><td>1.3</td></tr><tr><td>OTLP with key dictionary</td><td>29444</td><td>2.5</td></tr></table><pre>Exported 121 events.</pre><h3>Nested, in Body, no namespaces</h3><table><tr><th>Encoding</th><th>Wire size (bytes)</th><th>Encoding duration (ms)</th></tr><tr><td>JSON.stringify as-is</td><td>37148</td><td>0.2</td></tr><tr><td>OTLP JSON</td><td>108184</td><td>1.1</td></tr><tr><td>OTLP with key dictionary</td><td>26446</td><td>2.1</td></tr></table><pre>Exported 121 events.</pre></body>


## On mobile Chrome S23 Ultra

<body>
<h3>Flattened, in Attributes, with namespaces</h3><table><tr><th>Encoding</th><th>Wire size (bytes)</th><th>Encoding duration (ms)</th></tr><tr><td>JSON.stringify as-is</td><td>91583</td><td>0.8</td></tr><tr><td>OTLP JSON</td><td>162619</td><td>2.6</td></tr><tr><td>OTLP with key dictionary</td><td>29444</td><td>4.6</td></tr></table><pre>Exported 121 events.</pre><h3>Nested, in Body, no namespaces</h3><table><tr><th>Encoding</th><th>Wire size (bytes)</th><th>Encoding duration (ms)</th></tr><tr><td>JSON.stringify as-is</td><td>37148</td><td>0.4</td></tr><tr><td>OTLP JSON</td><td>108184</td><td>1.9</td></tr><tr><td>OTLP with key dictionary</td><td>26446</td><td>3.8</td></tr></table><pre>Exported 121 events.</pre></body>

# On mobile Oneplus 5

<body>
<h3>Flattened, in Attributes, with namespaces</h3><table><tr><th>Encoding</th><th>Wire size (bytes)</th><th>Encoding duration (ms)</th></tr><tr><td>JSON.stringify as-is</td><td>91583</td><td>0.8</td></tr><tr><td>OTLP JSON</td><td>162619</td><td>2.7</td></tr><tr><td>OTLP with key dictionary</td><td>29444</td><td>5.7</td></tr></table><pre>Exported 121 events.</pre><h3>Nested, in Body, no namespaces</h3><table><tr><th>Encoding</th><th>Wire size (bytes)</th><th>Encoding duration (ms)</th></tr><tr><td>JSON.stringify as-is</td><td>37148</td><td>1.4</td></tr><tr><td>OTLP JSON</td><td>108184</td><td>2.7</td></tr><tr><td>OTLP with key dictionary</td><td>26446</td><td>6.4</td></tr></table><pre>Exported 121 events.</pre></body>