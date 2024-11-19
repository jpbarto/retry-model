all: clean model.js run

fmt:
	tsfmt -r

model.js: model.ts
	tsc

run: model.js
	node model.js

clean:
	rm -f *.js
