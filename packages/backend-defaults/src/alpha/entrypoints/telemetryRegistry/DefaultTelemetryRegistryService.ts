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

import {
  TelemetryRegistryMetric,
  TelemetryRegistryService,
  TelemetryRegistrySpan,
  TracingServiceSpanKind,
} from '@backstage/backend-plugin-api/alpha';

const DEFAULT_MAX_SPANS = 1000;

/**
 * Options for creating a {@link DefaultTelemetryRegistryService}.
 *
 * @alpha
 */
export interface DefaultTelemetryRegistryServiceOptions {
  /**
   * The maximum number of distinct span names to keep track of. Spans with
   * new names are ignored once the limit is reached. Defaults to 1000.
   */
  maxSpans?: number;
}

function keyOf(pluginId: string, name: string) {
  return `${pluginId}\u0000${name}`;
}

function compareEntries(
  a: { pluginId: string; name: string },
  b: { pluginId: string; name: string },
) {
  return a.pluginId.localeCompare(b.pluginId) || a.name.localeCompare(b.name);
}

/**
 * Default in-memory implementation of the {@link TelemetryRegistryService}.
 *
 * @alpha
 */
export class DefaultTelemetryRegistryService
  implements TelemetryRegistryService
{
  readonly #metrics = new Map<string, TelemetryRegistryMetric>();
  readonly #spans = new Map<string, TelemetryRegistrySpan>();
  readonly #maxSpans: number;

  private constructor(opts?: DefaultTelemetryRegistryServiceOptions) {
    this.#maxSpans = opts?.maxSpans ?? DEFAULT_MAX_SPANS;
  }

  static create(
    opts?: DefaultTelemetryRegistryServiceOptions,
  ): DefaultTelemetryRegistryService {
    return new DefaultTelemetryRegistryService(opts);
  }

  registerMetric(metric: TelemetryRegistryMetric): void {
    this.#metrics.set(keyOf(metric.pluginId, metric.name), { ...metric });
  }

  registerSpan(span: {
    pluginId: string;
    name: string;
    kind: TracingServiceSpanKind;
  }): void {
    const key = keyOf(span.pluginId, span.name);
    const lastSeen = new Date().toISOString();
    const existing = this.#spans.get(key);
    if (existing) {
      existing.count += 1;
      existing.kind = span.kind;
      existing.lastSeen = lastSeen;
      return;
    }
    if (this.#spans.size >= this.#maxSpans) {
      return;
    }
    this.#spans.set(key, {
      pluginId: span.pluginId,
      name: span.name,
      kind: span.kind,
      count: 1,
      lastSeen,
    });
  }

  async listMetrics(): Promise<{ metrics: TelemetryRegistryMetric[] }> {
    const metrics = Array.from(this.#metrics.values(), m => ({ ...m }));
    return { metrics: metrics.sort(compareEntries) };
  }

  async listSpans(): Promise<{ spans: TelemetryRegistrySpan[] }> {
    const spans = Array.from(this.#spans.values(), s => ({ ...s }));
    return { spans: spans.sort(compareEntries) };
  }
}
