.PHONY: watch
watch:
	./node_modules/typescript/bin/tsc -w & node server.js

.PHONY: install
install:
	npm install typescript --save-dev
	npm install http-server
