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
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource, resourceFromAttributes } from '@opentelemetry/resources';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import {
  ConsoleMetricExporter,
  MetricReader,
  PeriodicExportingMetricReader,
  ViewOptions,
} from '@opentelemetry/sdk-metrics';
import { OTEL_ROOT_METER_NAME } from './constants';
import { getBackstageAutoInstrumentationConfigMap } from './autoInstrumentation';
import { BackstageInstrumentationConfig } from './types';

/**
 * Initializes the OpenTelemetry SDK for Backstage
 *
 * @internal
 */
export class InstrumentationInitializer {
  #initialized = false;

  async initialize({
    rootConfig,
    logger,
  }: {
    rootConfig?: Config;
    logger?: LoggerService;
  }): Promise<void> {
    const instrumentationConfig = await this.getInstrumentationConfig(
      rootConfig,
    );

    if (!instrumentationConfig) {
      logger?.warn('Instrumentation is disabled in app config - skipping');
      return;
    }

    if (this.#initialized) {
      logger?.warn('Instrumentation is already initialized - skipping');
      return;
    }

    const resource = await this.createResource(instrumentationConfig);

    const sdk = new NodeSDK({
      resource,
      metricReader: await this.createMetricReader({
        config: instrumentationConfig,
        logger,
      }),
      instrumentations: await this.getBackstageInstrumentations(),
      views: await this.getMetricViews(instrumentationConfig),
    });

    sdk.start();

    this.#initialized = true;

    logger?.info('Instrumentation initialized', {
      serviceName: resource.attributes[ATTR_SERVICE_NAME] as string,
      serviceVersion: resource.attributes[ATTR_SERVICE_VERSION] as string,
    });
  }

  private async getInstrumentationConfig(
    rootConfig?: Config,
  ): Promise<BackstageInstrumentationConfig | undefined> {
    const instrumentationConfig = rootConfig?.getOptionalConfig(
      'backend.instrumentation',
    );

    if (!instrumentationConfig) return undefined;

    const enabled =
      instrumentationConfig?.getOptionalBoolean('enabled') ?? true;
    if (!enabled) return undefined;

    return instrumentationConfig as BackstageInstrumentationConfig;
  }

  private async createResource(
    config: BackstageInstrumentationConfig,
  ): Promise<Resource> {
    const serviceName = config.resource?.serviceName ?? OTEL_ROOT_METER_NAME;
    const serviceVersion = config.resource?.serviceVersion ?? '1.40.2';

    return resourceFromAttributes({
      [ATTR_SERVICE_NAME]: serviceName,
      [ATTR_SERVICE_VERSION]: serviceVersion,
    });
  }

  private async createMetricReader({
    config,
    logger,
  }: {
    config: BackstageInstrumentationConfig;
    logger?: LoggerService;
  }): Promise<MetricReader> {
    const exporter = config.metrics?.exporters?.[0]?.type ?? 'console';

    if (exporter === 'console') {
      return new PeriodicExportingMetricReader({
        exportIntervalMillis: 1000,
        exporter: new ConsoleMetricExporter(),
      });
    }

    if (exporter === 'prometheus') {
      return new PrometheusExporter();
    }

    logger?.warn('Invalid metric exporter', { exporter });

    return new PeriodicExportingMetricReader({
      exportIntervalMillis: 1000,
      exporter: new ConsoleMetricExporter(),
    });
  }

  private async getBackstageInstrumentations() {
    return getNodeAutoInstrumentations(
      getBackstageAutoInstrumentationConfigMap(),
    );
  }

  private async getMetricViews(
    config: BackstageInstrumentationConfig,
  ): Promise<Array<ViewOptions> | undefined> {
    return config.metrics?.views as Array<ViewOptions> | undefined;
  }
}
