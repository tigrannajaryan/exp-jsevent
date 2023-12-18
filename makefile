.PHONY: watch
watch:
	./node_modules/typescript/bin/tsc -w & ./node_modules/http-server/bin/http-server -c-1

.PHONY: install
install:
	npm install typescript --save-dev
	npm install http-server
