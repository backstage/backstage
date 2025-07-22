/*
 * Copyright 2025 The Backstage Authors
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
  RootConfigService,
  RootLoggerService,
} from '@backstage/backend-plugin-api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from '@opentelemetry/sdk-metrics';

const readMockConfig = (_rootConfig?: RootConfigService) => {
  return {
    enabled: true,
    env: 'development', // poc placeholder
  };
};

export async function initializeTelemetry(opts: {
  rootConfig?: RootConfigService;
  rootLogger?: RootLoggerService;
}): Promise<void> {
  const { rootConfig, rootLogger } = opts;

  const telemetryConfig = readMockConfig(rootConfig);

  if (!telemetryConfig.enabled) {
    rootLogger?.info('Telemetry is disabled - skipping initialization');
    return;
  }

  const prometheus = new PrometheusExporter();
  const console = new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
    exportIntervalMillis: 1000,
  });

  // todo: we either want to disable some of these or only include the ones we want in a `@backstage/auto-instrumentations` package and use that here
  const defaultInstrumentations = getNodeAutoInstrumentations();

  const sdk = new NodeSDK({
    metricReader: telemetryConfig.env === 'development' ? console : prometheus,
    instrumentations: [defaultInstrumentations],
    // todo: resources, trace, views, etc
  });

  // todo: do we start here or return the sdk and let the caller start it?
  sdk.start();

  // todo: do we need to add stop mechanism to the RootLifecycleService?
  // rootLifecycleService.addShutdownHook(async () => await sdk.shutdown());

  rootLogger?.info('Telemetry initialized');
}
