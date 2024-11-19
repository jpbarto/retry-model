import { NodeSDK } from '@opentelemetry/sdk-node';
import opentelemetry from '@opentelemetry/api';
import {
    PeriodicExportingMetricReader,
    ConsoleMetricExporter,
    MeterProvider,
} from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter }from '@opentelemetry/exporter-metrics-otlp-proto';
import { Resource } from '@opentelemetry/resources';
import { 
    ATTR_SERVICE_NAME, 
    ATTR_SERVICE_VERSION 
} from "@opentelemetry/semantic-conventions";
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

diag.setLogger (new DiagConsoleLogger(), DiagLogLevel.INFO);

const sdk = new NodeSDK ({
    resource: new Resource ({
        [ATTR_SERVICE_NAME]: 'RetryModel',
        [ATTR_SERVICE_VERSION]: '0.1',
    }),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter(),
    }),
});
sdk.start ();