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

import { coreServices } from '@backstage/backend-plugin-api';
import { startTestBackend } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { prometheusExporterFactory } from './prometheusExporterService';
import { metrics } from '@opentelemetry/api';

describe('prometheusExporterService', () => {
  let config: ConfigReader;
  const logger = {
    info: jest.fn(),
  };

  it('should not enable the exporter if disabled', async () => {
    config = new ConfigReader({
      backend: {
        metrics: {
          disabled: true,
        },
      },
    });
    const http = { use: jest.fn() };
    await startTestBackend({
      services: [
        [coreServices.config, config],
        [coreServices.rootLogger, logger],
        [coreServices.rootHttpRouter, http],
        prometheusExporterFactory(),
      ],
    });

    expect(logger.info).toHaveBeenCalledWith('Prometheus exporter disabled');
    expect(metrics.getMeterProvider()).toEqual({});
  });

  it('should register the exporter under /metrics by default', async () => {
    config = new ConfigReader({});
    const http = { use: jest.fn() };
    await startTestBackend({
      services: [
        [coreServices.config, config],
        [coreServices.rootLogger, logger],
        [coreServices.rootHttpRouter, http],
        prometheusExporterFactory(),
      ],
    });

    expect(logger.info).toHaveBeenCalledWith(
      'Serving Prometheus metrics at /metrics',
    );
    expect(http.use).toHaveBeenCalledWith('/metrics', expect.any(Function));
  });

  it('should register the exporter on a custom path', async () => {
    config = new ConfigReader({
      backend: {
        metrics: {
          endpoint: '/foo',
        },
      },
    });
    const http = { use: jest.fn() };
    await startTestBackend({
      services: [
        [coreServices.config, config],
        [coreServices.rootLogger, logger],
        [coreServices.rootHttpRouter, http],
        prometheusExporterFactory(),
      ],
    });

    expect(logger.info).toHaveBeenCalledWith(
      'Serving Prometheus metrics at /foo',
    );
    expect(http.use).toHaveBeenCalledWith('/foo', expect.any(Function));
  });

  it('should register the exporter on a custom server', async () => {
    config = new ConfigReader({
      backend: {
        metrics: {
          customServer: true,
          host: '127.0.0.1',
        },
      },
    });
    const http = { use: jest.fn() };
    await startTestBackend({
      services: [
        [coreServices.config, config],
        [coreServices.rootLogger, logger],
        [coreServices.rootHttpRouter, http],
        prometheusExporterFactory(),
      ],
    });

    expect(logger.info).toHaveBeenCalledWith(
      'Started Prometheus exporter listener at http://127.0.0.1:9464/metrics',
    );

    expect(http.use).not.toHaveBeenCalledWith('/metrics', expect.any(Function));
  });
});
