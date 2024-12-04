.PHONY: run

all: clean model.js run

fmt:
	tsfmt -r

model.js: model.ts
	tsc

run:
	npx ts-node --require @opentelemetry/auto-instrumentations-node/register  --require ./instrumentation.ts model.ts

clean:
	rm -f *.js
