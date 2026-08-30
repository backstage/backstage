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

jest.mock('./loadOpen');
jest.mock('node:child_process');

import { execFileSync } from 'node:child_process';
import { openBrowser } from './openBrowser';
import { isOpenInstalled, loadOpen } from './loadOpen';

const flush = () => new Promise(resolve => setImmediate(resolve));

describe('openBrowser', () => {
  const originalEnv = process.env;
  const originalPlatform = process.platform;
  let openMock: jest.Mock;

  const setPlatform = (platform: string) =>
    Object.defineProperty(process, 'platform', { value: platform });

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.BROWSER;
    delete process.env.BROWSER_ARGS;
    // The AppleScript branch is opt-in per test.
    setPlatform('linux');

    openMock = jest.fn().mockResolvedValue(undefined);
    jest.mocked(isOpenInstalled).mockReturnValue(true);
    jest
      .mocked(loadOpen)
      .mockResolvedValue({ default: openMock } as unknown as Awaited<
        ReturnType<typeof loadOpen>
      >);
  });

  afterEach(() => {
    process.env = originalEnv;
    setPlatform(originalPlatform);
    jest.clearAllMocks();
  });

  it('returns false when BROWSER=none', () => {
    process.env.BROWSER = 'none';
    expect(openBrowser('http://example.com')).toBe(false);
  });

  it('returns false when the open peer dependency is not installed', () => {
    jest.mocked(isOpenInstalled).mockReturnValue(false);
    expect(openBrowser('http://example.com')).toBe(false);
  });

  it('opens the default browser when BROWSER is unset', async () => {
    expect(openBrowser('http://example.com')).toBe(true);
    await flush();
    expect(openMock).toHaveBeenCalledWith('http://example.com', {
      app: undefined,
      wait: false,
    });
  });

  it('passes BROWSER and BROWSER_ARGS as an app name and arguments', async () => {
    process.env.BROWSER = 'firefox';
    process.env.BROWSER_ARGS = '--private-window --new-tab';
    expect(openBrowser('http://example.com')).toBe(true);
    await flush();
    expect(openMock).toHaveBeenCalledWith('http://example.com', {
      app: { name: 'firefox', arguments: ['--private-window', '--new-tab'] },
      wait: false,
    });
  });

  it('reuses a running Chromium tab on macOS without re-encoding the URL', () => {
    setPlatform('darwin');
    // pgrep finds nothing until Chrome, then osascript succeeds.
    jest.mocked(execFileSync).mockImplementation((_file, args) => {
      if (args?.[0] === '-x' && args[1] !== 'Google Chrome') {
        throw new Error('no such process');
      }
      return '';
    });

    expect(openBrowser('http://example.com/?to=a%2Fb')).toBe(true);
    expect(execFileSync).toHaveBeenCalledWith(
      'osascript',
      ['-', 'http://example.com/?to=a%2Fb', 'Google Chrome'],
      // stdin must stay piped; osascript reads an empty script from /dev/null
      // and exits 0, which would look like success.
      {
        input: expect.stringContaining('on run argv'),
        stdio: ['pipe', 'ignore', 'ignore'],
      },
    );
    expect(openMock).not.toHaveBeenCalled();
  });
});
