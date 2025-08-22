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

import { ConfigReader } from '@backstage/config';
import { resolveDefaultEnvironment } from './defaultEnvironment';

describe('defaultEnvironment', () => {
  describe('resolveDefaultEnvironment', () => {
    it('should return empty when no defaultEnvironment config is provided', () => {
      const config = new ConfigReader({});
      const result = resolveDefaultEnvironment(config);

      expect(result).toEqual({
        parameters: {},
        secrets: {},
      });
    });

    it('should resolve parameters and secrets from config', () => {
      const config = new ConfigReader({
        scaffolder: {
          defaultEnvironment: {
            parameters: {
              region: 'us-east-1',
              organizationName: 'acme-corp',
              version: '1.0.0',
            },
            secrets: {
              AWS_ACCESS_KEY: 'test-secret-value',
              DATABASE_PASSWORD: 'db-password',
              LITERAL_SECRET: 'literal-value',
            },
          },
        },
      });

      const result = resolveDefaultEnvironment(config);

      expect(result).toEqual({
        parameters: {
          region: 'us-east-1',
          organizationName: 'acme-corp',
          version: '1.0.0',
        },
        secrets: {
          AWS_ACCESS_KEY: 'test-secret-value',
          DATABASE_PASSWORD: 'db-password',
          LITERAL_SECRET: 'literal-value',
        },
      });
    });

    it('should handle only parameters without secrets', () => {
      const config = new ConfigReader({
        scaffolder: {
          defaultEnvironment: {
            parameters: {
              region: 'eu-west-1',
            },
          },
        },
      });

      const result = resolveDefaultEnvironment(config);

      expect(result).toEqual({
        parameters: {
          region: 'eu-west-1',
        },
        secrets: {},
      });
    });
  });
});
