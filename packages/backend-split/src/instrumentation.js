/*
 * Copyright 2024 The Backstage Authors
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

const { NodeSDK } = require('@opentelemetry/sdk-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');

// Expose opentelemetry metrics using a Prometheus exporter on
// http://localhost:9464/metrics. See packages/backend/prometheus.yml for
// more information on how to scrape it.
const prometheus = new PrometheusExporter();

const sdk = new NodeSDK({
  // traceExporter: ...,
  metricReader: prometheus,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
