.PHONY: run

all: clean model.js run

fmt:
	tsfmt -r

model.js: model.ts
	tsc

run: 
	npx ts-node model.ts

clean:
	rm -f *.js
