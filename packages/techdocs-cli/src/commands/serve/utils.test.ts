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

import { resolveDeprecatedOption } from './utils';

describe('resolveDeprecatedOption', () => {
  const flags = { flag: '--engine-port', deprecatedFlag: '--mkdocs-port' };

  it('uses the new flag without warning', () => {
    const logger = { warn: jest.fn() };
    expect(
      resolveDeprecatedOption(logger, {
        ...flags,
        value: '9000',
        deprecatedValue: undefined,
      }),
    ).toBe('9000');
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('falls back to the deprecated flag and warns', () => {
    const logger = { warn: jest.fn() };
    expect(
      resolveDeprecatedOption(logger, {
        ...flags,
        value: undefined,
        deprecatedValue: '9000',
      }),
    ).toBe('9000');
    expect(logger.warn).toHaveBeenCalledWith(
      '--mkdocs-port is deprecated and will be removed in a future release. Use --engine-port instead.',
    );
  });

  it('prefers the new flag and says the deprecated one is ignored', () => {
    const logger = { warn: jest.fn() };
    expect(
      resolveDeprecatedOption(logger, {
        ...flags,
        value: '9000',
        deprecatedValue: '9001',
      }),
    ).toBe('9000');
    expect(logger.warn).toHaveBeenCalledWith(
      '--mkdocs-port is deprecated and will be removed in a future release. Use --engine-port instead. Ignoring it because --engine-port is also set.',
    );
  });

  it('returns undefined when neither flag is set', () => {
    const logger = { warn: jest.fn() };
    expect(
      resolveDeprecatedOption(logger, {
        ...flags,
        value: undefined,
        deprecatedValue: undefined,
      }),
    ).toBeUndefined();
    expect(logger.warn).not.toHaveBeenCalled();
  });
});
