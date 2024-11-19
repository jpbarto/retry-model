all: clean model.js run

model.js: model.ts
	tsc

run: model.js
	node model.js

clean:
	rm -f *.js
