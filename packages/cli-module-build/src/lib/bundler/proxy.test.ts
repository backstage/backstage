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

import { translateLegacyProxyOptions } from './proxy';

describe('translateLegacyProxyOptions', () => {
  let warn: jest.SpyInstance;

  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });

  it('renames path, drops logLevel, and warns about both', () => {
    expect(
      translateLegacyProxyOptions([
        {
          path: '/legacy',
          target: 'http://localhost:7007',
          changeOrigin: true,
          logLevel: 'debug',
        },
      ]),
    ).toEqual([
      {
        pathFilter: '/legacy',
        target: 'http://localhost:7007',
        changeOrigin: true,
      },
    ]);

    const warning = warn.mock.calls[0][0];
    expect(warning).toContain('rename it to `context`');
    expect(warning).toContain('`logLevel` is no longer supported');
  });

  it('passes through configuration that already uses the current options', () => {
    const current = [
      { context: ['/api'], target: 'http://localhost:7007' },
      { pathFilter: '/other', target: 'http://localhost:7008' },
    ];

    expect(translateLegacyProxyOptions(current)).toEqual(current);
    expect(translateLegacyProxyOptions(undefined)).toBeUndefined();
    expect(warn).not.toHaveBeenCalled();
  });

  it('does not let path override the current options', () => {
    expect(
      translateLegacyProxyOptions([
        { path: '/legacy', pathFilter: '/current' },
        { path: '/legacy', context: '/current' },
      ]),
    ).toEqual([{ pathFilter: '/current' }, { context: '/current' }]);

    expect(warn).toHaveBeenCalledTimes(1);
  });
});
