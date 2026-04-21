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

import { ConfigReader } from '@backstage/config';
import { collectSecretValues } from './collectConfigSecrets';

describe('collectSecretValues', () => {
  it('should collect a simple secret value', () => {
    const config = new ConfigReader({ token: 'abc123', name: 'test' });
    const secrets = collectSecretValues(config, {
      type: 'object',
      properties: {
        token: { type: 'string', visibility: 'secret' } as any,
        name: { type: 'string' },
      },
    });
    expect(Array.from(secrets)).toEqual(['abc123']);
  });

  it('should collect nested secret values', () => {
    const config = new ConfigReader({
      backend: { auth: { secret: 'pass' } },
    });
    const secrets = collectSecretValues(config, {
      type: 'object',
      properties: {
        backend: {
          type: 'object',
          properties: {
            auth: {
              type: 'object',
              properties: {
                secret: { type: 'string', visibility: 'secret' } as any,
              },
            },
          },
        },
      },
    });
    expect(Array.from(secrets)).toEqual(['pass']);
  });

  it('should collect secrets from array items', () => {
    const config = new ConfigReader({
      keys: [{ secret: 'key1' }, { secret: 'key2' }],
    });
    const secrets = collectSecretValues(config, {
      type: 'object',
      properties: {
        keys: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              secret: { type: 'string', visibility: 'secret' } as any,
            },
          },
        },
      },
    });
    expect(Array.from(secrets).sort()).toEqual(['key1', 'key2']);
  });

  it('should collect all strings for deep secret paths', () => {
    const config = new ConfigReader({
      credentials: { user: 'admin', pass: 'secret123' },
    });
    const secrets = collectSecretValues(config, {
      type: 'object',
      properties: {
        credentials: {
          type: 'object',
          deepVisibility: 'secret',
        } as any,
      },
    });
    expect(Array.from(secrets).sort()).toEqual(['admin', 'secret123']);
  });

  it('should collect secrets from dynamic keys', () => {
    const config = new ConfigReader({
      providers: {
        github: { clientSecret: 'gh-secret' },
        google: { clientSecret: 'goog-secret' },
      },
    });
    const secrets = collectSecretValues(config, {
      type: 'object',
      properties: {
        providers: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              clientSecret: { type: 'string', visibility: 'secret' } as any,
            },
          },
        },
      },
    });
    expect(Array.from(secrets).sort()).toEqual(['gh-secret', 'goog-secret']);
  });

  it('should return empty set when config path does not exist', () => {
    const config = new ConfigReader({});
    const secrets = collectSecretValues(config, {
      type: 'object',
      properties: {
        missing: { type: 'string', visibility: 'secret' } as any,
      },
    });
    expect(Array.from(secrets)).toEqual([]);
  });

  it('should only collect strings for non-deep leaf secrets', () => {
    const config = new ConfigReader({
      token: { nested: 'should-not-appear' },
    });
    const secrets = collectSecretValues(config, {
      type: 'object',
      properties: {
        token: { type: 'string', visibility: 'secret' } as any,
      },
    });
    expect(Array.from(secrets)).toEqual([]);
  });

  it('should not read non-secret config keys', () => {
    const config = new ConfigReader({
      secret: 'hidden',
      public: 'visible',
    });
    const spy = jest.spyOn(config, 'getOptional');

    collectSecretValues(config, {
      type: 'object',
      properties: {
        secret: { type: 'string', visibility: 'secret' } as any,
        public: { type: 'string' },
      },
    });

    const calledKeys = spy.mock.calls.map(c => c[0]);
    expect(calledKeys).toContain('secret');
    expect(calledKeys).not.toContain('public');
    expect(calledKeys).not.toContain(undefined);
  });
});
