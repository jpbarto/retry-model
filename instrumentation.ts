// OTel imports
import { NodeSDK, logs, tracing } from '@opentelemetry/sdk-node';
// import opentelemetry from '@opentelemetry/api';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import {
    ATTR_SERVICE_NAME,
    ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
// Metric imports
import {
    PeriodicExportingMetricReader,
    // ConsoleMetricExporter,
    // MeterProvider,
} from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
// Trace imports
// import { BasicTracerProvider, SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
// Logging imports
import { BunyanInstrumentation } from '@opentelemetry/instrumentation-bunyan';


const sdk = new NodeSDK({
    resource: new Resource({
        [ATTR_SERVICE_NAME]: 'RetryModel',
        [ATTR_SERVICE_VERSION]: '0.1',
    }),
    // spanProcessor: new SimpleSpanProcessor(new OTLPTraceExporter()),
    // logRecordProcessor: new logs.SimpleLogRecordProcessor(new logs.ConsoleLogRecordExporter()),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter(),
    }),
    traceExporter: new OTLPTraceExporter(),
    instrumentations: [getNodeAutoInstrumentations(), new BunyanInstrumentation ()],
});
sdk.start();

// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);