import opentelemetry from '@opentelemetry/api';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';

const exporterOptions = {
  url: 'https://test.com',
  headers: {
    Authorization: `Basic addasdassdasdaasdsdaasdads`,
  },
};

const metricExporter = new OTLPMetricExporter(exporterOptions);

const resource = Resource.default().merge(
  new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'dice-server',
    [SEMRESATTRS_SERVICE_VERSION]: '0.1.0',
  }),
);

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 10000,
});

const myServiceMeterProvider = new MeterProvider({
  resource: resource,
  readers: [metricReader],
});

opentelemetry.metrics.setGlobalMeterProvider(myServiceMeterProvider);

export default metricReader;
