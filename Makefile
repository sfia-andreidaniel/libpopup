SHELL := /bin/bash

build:: clean
	tsc js/main.ts --target es5 --out main.js

clean::
	rm -f main.js js/*.js
