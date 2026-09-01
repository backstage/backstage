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

import type { LoggerService } from '@backstage/backend-plugin-api';
import { Config, ConfigReader } from '@backstage/config';
import { loadConfigSchema } from '@backstage/config-loader';
import { getPackages } from '@manypkg/get-packages';
import { SystemSecretSource } from './SystemSecretSource';
import { TASK_REDACTION_OVERFLOW } from './TaskRedacter';

jest.mock('@manypkg/get-packages', () => ({ getPackages: jest.fn() }));
jest.mock('@backstage/config-loader', () => {
  const actual = jest.requireActual('@backstage/config-loader');
  return {
    ...actual,
    loadConfigSchema: jest.fn(actual.loadConfigSchema),
  };
});

async function createFixture(initialSecret: string) {
  let current = new ConfigReader({ secret: initialSecret });
  let onChange: (() => void) | undefined;
  const unsubscribe = jest.fn();
  const config = {
    getOptional: () => current.getOptional(),
    subscribe(callback: () => void) {
      onChange = callback;
      return { unsubscribe };
    },
  } as unknown as Config;
  const schema = await loadConfigSchema({
    serialized: {
      schemas: [
        {
          value: {
            type: 'object',
            properties: {
              secret: { type: 'string', visibility: 'secret' },
            },
          },
          path: '/mock',
        },
      ],
      backstageConfigSchemaVersion: 1,
    },
  });

  return {
    config,
    schema,
    unsubscribe,
    update(secret: string) {
      current = new ConfigReader({ secret });
      onChange?.();
    },
  };
}

describe('SystemSecretSource', () => {
  it('reuses immutable schema discovery across secret sources', async () => {
    jest.mocked(getPackages).mockResolvedValue({
      packages: [],
    } as unknown as Awaited<ReturnType<typeof getPackages>>);
    jest.mocked(getPackages).mockClear();
    jest.mocked(loadConfigSchema).mockClear();
    const options = {
      config: new ConfigReader({}),
      logger: { warn() {} } as unknown as LoggerService,
      dir: '/same-directory',
    };

    const first = await SystemSecretSource.create(options);
    const second = await SystemSecretSource.create(options);

    expect(getPackages).toHaveBeenCalledTimes(1);
    expect(loadConfigSchema).toHaveBeenCalledTimes(1);
    first.close();
    second.close();
  });

  it('returns an initial schema-classified snapshot', async () => {
    const fixture = await createFixture('initial-secret');
    const source = new SystemSecretSource(fixture);

    const subscription = source.subscribe(() => {});

    expect(Array.from(subscription.secrets)).toEqual(['initial-secret']);
  });

  it('notifies active attempts with a fresh snapshot on config changes', async () => {
    const fixture = await createFixture('initial-secret');
    const source = new SystemSecretSource(fixture);
    const listener = jest.fn();
    const subscription = source.subscribe(listener);

    fixture.update('rotated-secret');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(Array.from(listener.mock.calls[0][0])).toEqual(['rotated-secret']);
    expect(Array.from(subscription.secrets)).toEqual(['initial-secret']);
    expect(Array.from(source.subscribe(() => {}).secrets)).toEqual([
      'rotated-secret',
    ]);
  });

  it('fails closed when config secrets cannot be refreshed', async () => {
    const fixture = await createFixture('initial-secret');
    const source = new SystemSecretSource(fixture);
    const listener = jest.fn();
    source.subscribe(listener);
    jest.spyOn(fixture.schema, 'process').mockImplementationOnce(() => {
      throw new Error('refresh failed with rotated-secret');
    });

    expect(() => fixture.update('rotated-secret')).not.toThrow();

    expect(listener).toHaveBeenCalledWith(new Set([TASK_REDACTION_OVERFLOW]));
    expect(Array.from(source.subscribe(() => {}).secrets)).toEqual([
      TASK_REDACTION_OVERFLOW,
    ]);
  });

  it('subscribes the listener before returning its snapshot', async () => {
    const fixture = await createFixture('initial-secret');
    const source = new SystemSecretSource(fixture);
    const listener = jest.fn();

    const subscription = source.subscribe(listener);
    fixture.update('rotated-secret');

    expect(Array.from(subscription.secrets)).toEqual(['initial-secret']);
    expect(Array.from(listener.mock.calls[0][0])).toEqual(['rotated-secret']);
  });

  it('unsubscribes attempt listeners and the config subscription', async () => {
    const fixture = await createFixture('initial-secret');
    const source = new SystemSecretSource(fixture);
    const listener = jest.fn();
    const subscription = source.subscribe(listener);

    subscription.unsubscribe();
    fixture.update('rotated-secret');
    source.close();

    expect(listener).not.toHaveBeenCalled();
    expect(fixture.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
