/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { metrics } from '@opentelemetry/api';

/** @public */
export const prometheusExporterFactory = createServiceFactory({
  service: coreServices.prometheusExporter,
  deps: {
    config: coreServices.config,
    logger: coreServices.rootLogger,
    lifecycle: coreServices.rootLifecycle,
    http: coreServices.rootHttpRouter,
  },
  async factory({ config, logger, lifecycle, http }) {
    if (config.getOptionalBoolean('backend.metrics.disabled')) {
      logger.info('Prometheus exporter disabled');
      return {};
    }

    const host = config.getOptionalString('backend.metrics.endpoint');
    const port = config.getOptionalNumber('backend.metrics.port') || 9464;
    const endpoint =
      config.getOptionalString('backend.metrics.endpoint') || '/metrics';

    const exporter = new PrometheusExporter({
      preventServerStart: true,
      port,
      host,
      endpoint,
    });

    if (config.getOptionalBoolean('backend.metrics.customServer')) {
      await exporter.startServer();
      logger.info(
        `Started Prometheus exporter listener at http://${
          host ?? '0.0.0.0'
        }:${port}${endpoint}`,
      );
    } else {
      logger.info(`Serving Prometheus metrics at ${endpoint}`);
      http.use(endpoint, exporter.getMetricsRequestHandler.bind(exporter));
      lifecycle.addShutdownHook({
        fn: async () => await exporter.stopServer(),
      });
    }

    const meterProvider = new MeterProvider();
    meterProvider.addMetricReader(exporter);
    metrics.setGlobalMeterProvider(meterProvider);
    return {};
  },
});
