.PHONY: run

all: clean model.js run

fmt:
	tsfmt -r

model.js: model.ts
	tsc

run: 
	OTEL_METRIC_EXPORT_INTERVAL=5000 && npx ts-node --require ./instrumentation.ts model.ts

clean:
	rm -f *.js
