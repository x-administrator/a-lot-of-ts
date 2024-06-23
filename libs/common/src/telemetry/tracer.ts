import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import * as opentelemetry from '@opentelemetry/sdk-node';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { ConfigsUtils } from '../config/configs.utils';

export function tracer(config: ConfigsUtils) {
  const traceExporter = new OTLPTraceExporter(config.otlpTransporterOptions);

  const sdk = new opentelemetry.NodeSDK({
    traceExporter,
    instrumentations: [
      new PrismaInstrumentation(),
      new HttpInstrumentation(),
      new FastifyInstrumentation(),
      new GraphQLInstrumentation({}),
    ],
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: 'yourServiceName',
      [SEMRESATTRS_SERVICE_VERSION]: '1.0',
    }),
  });

  sdk.start();

  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });
  return sdk;
}
