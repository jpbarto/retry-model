.PHONY: monitoring

all: clean model.js run

fmt:
	tsfmt -r

model.js: model.ts
	tsc

run: model.ts
	npx ts-node --require ./instrumentation.ts model.ts

clean:
	rm -f *.js

monitoring:
	CURR_DIR=$(shell pwd) && docker run -d -p 4317:4317 -p 4318:4318 --rm -v ${CURR_DIR}/monitoring/otel-collector/collector-config.yaml:/etc/otelcol/config.yaml otel/opentelemetry-collector
	cd monitoring/grafana && docker compose up
