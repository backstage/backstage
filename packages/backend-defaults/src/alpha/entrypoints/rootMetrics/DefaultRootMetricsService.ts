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
  Counter,
  Gauge,
  Histogram,
  Meter,
  MetricOptions,
  ObservableCounter,
  ObservableGauge,
  ObservableUpDownCounter,
  UpDownCounter,
  metrics,
} from '@opentelemetry/api';
import {
  MetricsService,
  RootMetricsService,
} from '@backstage/backend-plugin-api/alpha';
import { Config } from '@backstage/config';
import { PluginMetricsService } from './PluginMetricsService';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import {
  ConsoleMetricExporter,
  MetricReader,
  PeriodicExportingMetricReader,
  ViewOptions,
} from '@opentelemetry/sdk-metrics';
import { getBackstageNodeAutoInstrumentationConfigMap } from './getBackstageNodeAutoInstrumentations';
import { NoopRootMetricsService } from './NoopRootMetricsService';
import { DEFAULT_SERVICE_NAME } from './constants';
import {
  RootConfigService,
  RootLoggerService,
} from '@backstage/backend-plugin-api';

export class DefaultRootMetricsService implements RootMetricsService {
  private readonly meter: Meter;
  private readonly serviceName: string;
  private readonly serviceVersion?: string;
  private readonly logger: RootLoggerService;

  private constructor({
    serviceName,
    serviceVersion,
    logger,
  }: {
    serviceName: string;
    serviceVersion?: string;
    logger: RootLoggerService;
  }) {
    this.serviceName = serviceName;
    this.serviceVersion = serviceVersion;
    this.logger = logger;

    this.meter = metrics.getMeter(this.serviceName, this.serviceVersion);
  }

  static async fromConfig({
    config,
    logger,
  }: {
    config: RootConfigService;
    logger: RootLoggerService;
  }): Promise<RootMetricsService> {
    const instrumentationConfig = config?.getOptionalConfig(
      'backend.instrumentation',
    );
    const enabled =
      instrumentationConfig?.getOptionalBoolean('enabled') ?? false;

    if (!enabled) {
      logger.warn(
        'Metrics are disabled in the config - skipping metrics initialization',
      );
      return new NoopRootMetricsService();
    }

    const metricsEnabled =
      instrumentationConfig
        ?.getOptionalConfig('metrics')
        ?.getOptionalBoolean('enabled') ?? false;

    const resource = resourceFromAttributes({
      [ATTR_SERVICE_NAME]:
        instrumentationConfig
          ?.getOptionalConfig('resource')
          ?.getOptionalString('serviceName') ?? DEFAULT_SERVICE_NAME,
      [ATTR_SERVICE_VERSION]: instrumentationConfig
        ?.getOptionalConfig('resource')
        ?.getOptionalString('serviceVersion'),
    });

    const backstageInstrumentationConfigMap =
      await getBackstageNodeAutoInstrumentationConfigMap();

    const sdk = new NodeSDK({
      resource,
      instrumentations: getNodeAutoInstrumentations(
        backstageInstrumentationConfigMap,
      ),
      metricReader: metricsEnabled
        ? await DefaultRootMetricsService.createMetricReader(
            instrumentationConfig!,
          )
        : undefined,
      views: metricsEnabled
        ? await DefaultRootMetricsService.getMetricViews(instrumentationConfig!)
        : undefined,
    });

    sdk.start();

    logger.info('Metrics initialized - sdk started');

    return new DefaultRootMetricsService({
      serviceName: resource.attributes[ATTR_SERVICE_NAME] as string,
      serviceVersion: resource.attributes[ATTR_SERVICE_VERSION] as string,
      logger,
    });
  }

  private static async createMetricReader(
    config: Config,
  ): Promise<MetricReader> {
    const metricsConfig = config.getOptionalConfig('metrics');
    const exporters = metricsConfig?.getOptionalConfigArray('exporters');

    const firstEnabledExporter = exporters?.find(
      exporterConfig => exporterConfig.getOptionalBoolean('enabled') ?? true,
    );
    const exporterType = firstEnabledExporter?.getOptionalString('type');

    switch (exporterType) {
      case 'prometheus':
        return new PrometheusExporter();
      default:
        return new PeriodicExportingMetricReader({
          exportIntervalMillis: 1000,
          exporter: new ConsoleMetricExporter(),
        });
    }
  }

  private static async getMetricViews(
    config: Config,
  ): Promise<Array<ViewOptions> | undefined> {
    const metricsConfig = config.getOptionalConfig('metrics');
    return metricsConfig?.getOptionalConfigArray('views') as
      | Array<ViewOptions>
      | undefined;
  }

  forPlugin(pluginId: string): MetricsService {
    this.logger.info('Creating plugin-scoped metrics service', { pluginId });

    return new PluginMetricsService({
      pluginId,
      serviceName: this.serviceName,
      serviceVersion: this.serviceVersion,
    });
  }

  private prefixMetricName(name: string): string {
    // todo: this is wrong - missing core service id
    return `${this.serviceName}.core.${name}`;
  }

  createCounter(name: string, options?: MetricOptions): Counter {
    return this.meter.createCounter(this.prefixMetricName(name), options);
  }

  createUpDownCounter(name: string, options?: MetricOptions): UpDownCounter {
    return this.meter.createUpDownCounter(this.prefixMetricName(name), options);
  }

  createHistogram(name: string, options?: MetricOptions): Histogram {
    return this.meter.createHistogram(this.prefixMetricName(name), options);
  }

  createGauge(name: string, options?: MetricOptions): Gauge {
    return this.meter.createGauge(this.prefixMetricName(name), options);
  }

  createObservableCounter(
    name: string,
    options?: MetricOptions,
  ): ObservableCounter {
    return this.meter.createObservableCounter(
      this.prefixMetricName(name),
      options,
    );
  }

  createObservableUpDownCounter(
    name: string,
    options?: MetricOptions,
  ): ObservableUpDownCounter {
    return this.meter.createObservableUpDownCounter(
      this.prefixMetricName(name),
      options,
    );
  }

  createObservableGauge(
    name: string,
    options?: MetricOptions,
  ): ObservableGauge {
    return this.meter.createObservableGauge(
      this.prefixMetricName(name),
      options,
    );
  }
}
