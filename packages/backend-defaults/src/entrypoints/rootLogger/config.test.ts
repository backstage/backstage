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
import { mockServices } from '@backstage/backend-test-utils';
import { getRootLoggerConfig } from './config';

describe('getRootLoggerConfig', () => {
  it('should load the configuration without throwing', () => {
    const config = {
      backend: {
        logger: {
          level: 'info',
          meta: {
            env: 'prod',
          },
          overrides: [
            {
              matchers: {
                plugin: 'catalog',
              },
              level: 'warn',
            },
          ],
        },
      },
    };

    expect(() =>
      getRootLoggerConfig(
        mockServices.rootConfig({
          data: config,
        }),
      ),
    ).not.toThrow();
  });

  it('should throw if an override is using an invalid level', () => {
    const config = {
      backend: {
        logger: {
          level: 'info',
          meta: {
            env: 'prod',
          },
          overrides: [
            {
              matchers: {
                plugin: 'catalog',
              },
              level: 'invalid',
            },
          ],
        },
      },
    };

    expect(() =>
      getRootLoggerConfig(mockServices.rootConfig({ data: config })),
    ).toThrow(
      "Invalid config at backend.logger.overrides[0].level, 'invalid' is not a valid logging level, must be one of 'error', 'warn', 'info' or 'debug'.",
    );
  });
});
