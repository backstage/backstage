/*
 * Copyright 2026 The Backstage Authors
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

import { Meter, metrics } from '@opentelemetry/api';
import { LoggerService } from '@backstage/backend-plugin-api';
import {
  MetricsService,
  MetricAttributes,
  MetricOptions,
  MetricsServiceCounter,
  MetricsServiceUpDownCounter,
  MetricsServiceHistogram,
  MetricsServiceGauge,
  MetricsServiceObservableCounter,
  MetricsServiceObservableGauge,
  MetricsServiceObservableUpDownCounter,
} from '@backstage/backend-plugin-api/alpha';

/**
 * Options for creating a {@link DefaultMetricsService}.
 *
 * @alpha
 */
export interface DefaultMetricsServiceOptions {
  name: string;
  version?: string;
  schemaUrl?: string;
  logger?: LoggerService;
}

interface CachedInstrument {
  instrument: unknown;
  scopeName: string;
  opts: MetricOptions | undefined;
}

/**
 * Default implementation of the {@link MetricsService} interface.
 *
 * This implementation provides a thin wrapper around the OpenTelemetry Meter API.
 *
 * @alpha
 */
export class DefaultMetricsService implements MetricsService {
  private readonly meter: Meter;
  private readonly scopeName: string;
  private readonly logger?: LoggerService;

  // Instruments are cached process-wide, keyed by kind and metric name. When
  // multiple plugins (each with their own Meter/Instrumentation Scope) create
  // an instrument with the same name, the OpenTelemetry Prometheus exporter
  // emits one `# HELP`/`# TYPE` block per scope, producing duplicate HELP
  // lines for the same metric name. That violates the Prometheus text
  // exposition format and causes scrapes to fail. Caching by name ensures a
  // metric name maps to a single underlying instrument, regardless of which
  // plugin creates it first.
  //
  // Because this collapses instruments across otherwise-unrelated plugins,
  // a second registration with a different description/unit for the same
  // name is silently discarded rather than erroring or creating a separate
  // series (Prometheus has no way to represent that). We log a warning so
  // the collision is visible instead of silently producing a metric with
  // the wrong documentation, and so an accidental name collision between
  // two plugins that did not intend to share a metric can be noticed and
  // renamed.
  private static readonly instrumentCache = new Map<string, CachedInstrument>();

  private constructor(opts: DefaultMetricsServiceOptions) {
    this.scopeName = opts.name;
    this.logger = opts.logger;
    // The meter name sets the OpenTelemetry Instrumentation Scope which identifies the source of metrics in telemetry backends.
    this.meter = metrics.getMeter(opts.name, opts.version, {
      schemaUrl: opts.schemaUrl,
    });
  }

  /**
   * Creates a new {@link MetricsService} instance.
   *
   * @param opts - Options for configuring the meter scope
   * @returns A new MetricsService instance
   */
  static create(opts: DefaultMetricsServiceOptions): MetricsService {
    return new DefaultMetricsService(opts);
  }

  private getOrCreateInstrument<T>(
    kind: string,
    name: string,
    opts: MetricOptions | undefined,
    create: () => T,
  ): T {
    const key = `${kind}:${name}`;
    const existing = DefaultMetricsService.instrumentCache.get(key);
    if (existing) {
      if (
        existing.opts?.description !== opts?.description ||
        existing.opts?.unit !== opts?.unit
      ) {
        this.logger?.warn(
          `Metric '${name}' (${kind}) was already registered by ` +
            `'${existing.scopeName}' with different options; reusing that ` +
            `instrument and ignoring the options requested by ` +
            `'${this.scopeName}'. Prometheus does not support multiple ` +
            `HELP/TYPE definitions for the same metric name, so if these ` +
            `are unrelated metrics that happen to share a name, rename one ` +
            `of them to avoid the collision.`,
        );
      }
      return existing.instrument as T;
    }
    const instrument = create();
    DefaultMetricsService.instrumentCache.set(key, {
      instrument,
      opts,
      scopeName: this.scopeName,
    });
    return instrument;
  }

  createCounter<TAttributes extends MetricAttributes = MetricAttributes>(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceCounter<TAttributes> {
    return this.getOrCreateInstrument('counter', name, opts, () =>
      this.meter.createCounter<TAttributes>(name, opts),
    );
  }

  createUpDownCounter<TAttributes extends MetricAttributes = MetricAttributes>(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceUpDownCounter<TAttributes> {
    return this.getOrCreateInstrument('upDownCounter', name, opts, () =>
      this.meter.createUpDownCounter<TAttributes>(name, opts),
    );
  }

  createHistogram<TAttributes extends MetricAttributes = MetricAttributes>(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceHistogram<TAttributes> {
    return this.getOrCreateInstrument('histogram', name, opts, () =>
      this.meter.createHistogram<TAttributes>(name, opts),
    );
  }

  createGauge<TAttributes extends MetricAttributes = MetricAttributes>(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceGauge<TAttributes> {
    return this.getOrCreateInstrument('gauge', name, opts, () =>
      this.meter.createGauge<TAttributes>(name, opts),
    );
  }

  createObservableCounter<
    TAttributes extends MetricAttributes = MetricAttributes,
  >(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceObservableCounter<TAttributes> {
    return this.getOrCreateInstrument('observableCounter', name, opts, () =>
      this.meter.createObservableCounter<TAttributes>(name, opts),
    );
  }

  createObservableUpDownCounter<
    TAttributes extends MetricAttributes = MetricAttributes,
  >(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceObservableUpDownCounter<TAttributes> {
    return this.getOrCreateInstrument(
      'observableUpDownCounter',
      name,
      opts,
      () => this.meter.createObservableUpDownCounter<TAttributes>(name, opts),
    );
  }

  createObservableGauge<
    TAttributes extends MetricAttributes = MetricAttributes,
  >(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceObservableGauge<TAttributes> {
    return this.getOrCreateInstrument('observableGauge', name, opts, () =>
      this.meter.createObservableGauge<TAttributes>(name, opts),
    );
  }
}
