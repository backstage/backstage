/*
 * Copyright 2020 The Backstage Authors
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

import { render } from '@testing-library/react';
import { defaultConfigLoaderSync } from './defaultConfigLoader';
import { ConfigReader } from '@backstage/config';

(process as any).env = { NODE_ENV: 'test' };
const anyEnv = process.env as any;
const anyWindow = window as any;

describe('defaultConfigLoaderSync', () => {
  afterEach(() => {
    delete anyEnv.APP_CONFIG;
    delete anyWindow.__APP_CONFIG__;
  });

  it('loads nothing is config is missing', () => {
    expect(defaultConfigLoaderSync()).toEqual([]);
  });

  it('loads static config', () => {
    anyEnv.APP_CONFIG = [
      { data: { my: 'config' }, context: 'a' },
      { data: { my: 'override-config' }, context: 'b' },
    ];

    const configs = defaultConfigLoaderSync();
    expect(configs).toEqual([
      { data: { my: 'config' }, context: 'a' },
      { data: { my: 'override-config' }, context: 'b' },
    ]);
  });

  it('loads runtime config', () => {
    anyEnv.APP_CONFIG = [
      { data: { my: 'override-config' }, context: 'a' },
      { data: { my: 'config' }, context: 'b' },
    ];

    const configs = (defaultConfigLoaderSync as any)('{"my":"runtime-config"}');
    expect(configs).toEqual([
      { data: { my: 'override-config' }, context: 'a' },
      { data: { my: 'config' }, context: 'b' },
      { data: { my: 'runtime-config' }, context: 'env' },
    ]);
  });

  it('loads config from script tags and ignore static config', () => {
    anyEnv.APP_CONFIG = [];

    render(
      <script type="backstage.io/config">
        {`[{"data":{"my":"config"},"context":"a"},{"data":{"my":"override-config"},"context":"b"}]`}
      </script>,
    );

    const configs = (defaultConfigLoaderSync as any)('{"my":"runtime-config"}');
    expect(configs).toEqual([
      { data: { my: 'config' }, context: 'a' },
      { data: { my: 'override-config' }, context: 'b' },
    ]);
    expect(ConfigReader.fromConfigs(configs).get('my')).toBe('override-config');
  });

  it('loads config from all script tags in order', () => {
    anyEnv.APP_CONFIG = [];

    render(
      <>
        <script type="backstage.io/config">
          {`[{"data":{"my":"config"},"context":"a"}]`}
        </script>
        <script type="backstage.io/config">
          {`[{"data":{"my":"override-config"},"context":"b"}]`}
        </script>
      </>,
    );

    const configs = (defaultConfigLoaderSync as any)('{"my":"runtime-config"}');
    expect(configs).toEqual([
      { data: { my: 'config' }, context: 'a' },
      { data: { my: 'override-config' }, context: 'b' },
    ]);
    expect(ConfigReader.fromConfigs(configs).get('my')).toBe('override-config');
  });

  it('fails to load invalid static config', () => {
    anyEnv.APP_CONFIG = { my: 'invalid-config' };
    expect(() => defaultConfigLoaderSync()).toThrow(
      'Static configuration has invalid format',
    );
  });

  it('fails to load bad runtime config', () => {
    anyEnv.APP_CONFIG = [{ data: { my: 'config' }, context: 'a' }];

    expect(() => defaultConfigLoaderSync('}')).toThrow(
      'Failed to load runtime configuration, SyntaxError: Unexpected token',
    );
  });

  it('loads config from window.__APP_CONFIG__', () => {
    anyEnv.APP_CONFIG = [
      { data: { my: 'config' }, context: 'a' },
      { data: { my: 'override-config' }, context: 'b' },
    ];
    const windowConfig = { app: { configKey: 'config-value' } };
    anyWindow.__APP_CONFIG__ = windowConfig;

    const configs = defaultConfigLoaderSync();

    expect(configs).toEqual([
      ...anyEnv.APP_CONFIG,
      { context: 'window', data: windowConfig },
    ]);
  });
});
