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

jest.mock('open', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

import { openBrowser } from './vendored/react-dev-utils/openBrowser';

describe('openBrowser', () => {
  const originalBrowser = process.env.BROWSER;

  afterEach(() => {
    if (originalBrowser !== undefined) {
      process.env.BROWSER = originalBrowser;
    } else {
      delete process.env.BROWSER;
    }
  });

  it('returns false when BROWSER=none', () => {
    process.env.BROWSER = 'none';
    expect(openBrowser('http://example.com')).toBe(false);
  });

  it('returns true and uses open when BROWSER is set to a non-Chromium app', () => {
    process.env.BROWSER = 'firefox';
    const result = openBrowser('http://example.com');
    expect(result).toBe(true);
    const open = require('open').default;
    expect(open).toHaveBeenCalledWith(
      'http://example.com',
      expect.objectContaining({ wait: false }),
    );
  });
});
