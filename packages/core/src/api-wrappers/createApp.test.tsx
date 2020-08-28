/*
 * Copyright 2020 Spotify AB
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

import { defaultConfigLoader } from './createApp';
import { AppConfig } from '@backstage/config';

describe('defaultConfigLoader', () => {
  afterEach(() => {
    delete process.env.APP_CONFIG;
  });

  it('loads static config', async () => {
    Object.defineProperty(process.env, 'APP_CONFIG', {
      configurable: true,
      value: [
        { data: { my: 'config' }, context: 'a' },
        { data: { my: 'override-config' }, context: 'b' },
      ] as AppConfig[],
    });
    const configs = await defaultConfigLoader();
    expect(configs).toEqual([
      { data: { my: 'config' }, context: 'a' },
      { data: { my: 'override-config' }, context: 'b' },
    ]);
  });

  it('loads runtime config', async () => {
    Object.defineProperty(process.env, 'APP_CONFIG', {
      configurable: true,
      value: [
        { data: { my: 'override-config' }, context: 'a' },
        { data: { my: 'config' }, context: 'b' },
      ] as AppConfig[],
    });
    const configs = await (defaultConfigLoader as any)(
      '{"my":"runtime-config"}',
    );
    expect(configs).toEqual([
      { data: { my: 'override-config' }, context: 'a' },
      { data: { my: 'config' }, context: 'b' },
      { data: { my: 'runtime-config' }, context: 'env' },
    ]);
  });

  it('fails to load invalid missing config', async () => {
    await expect(defaultConfigLoader()).rejects.toThrow(
      'No static configuration provided',
    );
  });

  it('fails to load invalid static config', async () => {
    Object.defineProperty(process.env, 'APP_CONFIG', {
      configurable: true,
      value: { my: 'invalid-config' } as any,
    });
    await expect(defaultConfigLoader()).rejects.toThrow(
      'Static configuration has invalid format',
    );
  });

  it('fails to load bad runtime config', async () => {
    Object.defineProperty(process.env, 'APP_CONFIG', {
      configurable: true,
      value: [{ data: { my: 'config' }, context: 'a' }] as AppConfig[],
    });

    await expect((defaultConfigLoader as any)('}')).rejects.toThrow(
      'Failed to load runtime configuration, SyntaxError: Unexpected token } in JSON at position 0',
    );
  });
});
