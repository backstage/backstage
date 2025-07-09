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
import { InstrumentationConfigMap } from '@opentelemetry/auto-instrumentations-node';
import * as OtelApi from '@opentelemetry/api';
import { MetricCollectOptions, ViewOptions } from '@opentelemetry/sdk-metrics';

/**
 * Resource configuration following OTEL resource semantic conventions
 */
export interface ResourceConfig {
  /**
   * Service name for resource identification
   * Maps to OTEL_SERVICE_NAME
   * @default "backstage"
   */
  serviceName?: string;

  /**
   * Service version for resource identification
   * Maps to OTEL_SERVICE_VERSION
   * @default "unknown"
   */
  serviceVersion?: string;

  /**
   * Additional resource attributes
   * Maps to OTEL_RESOURCE_ATTRIBUTES
   */
  attributes?: OtelApi.Attributes;
}

export interface MetricsExporterConfig {
  type: 'console' | 'prometheus';
  enabled?: boolean;
}

/**
 * The configuration for the instrumentation of the Backstage backend.
 */
export interface BackstageInstrumentationConfig {
  enabled?: boolean;

  resource?: ResourceConfig;
  autoInstrumentations?: InstrumentationConfigMap;

  metrics?: {
    enabled?: boolean;

    collection?: MetricCollectOptions;

    exporters?: Array<MetricsExporterConfig>;

    views?: Array<ViewOptions>;
  };
}
