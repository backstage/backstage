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
import { createLevelOverridesFormatter } from './levelOverridesFormatter';
import { RootLoggerOverrideConfig } from './types';

describe('levelOverridesFormatter', () => {
  const overridesConfig: RootLoggerOverrideConfig[] = [
    // Ignore catalog plugin logs unless they are warnings or more
    {
      matchers: {
        plugin: 'ignored',
      },
      level: 'warn',
    },
    // Ignore logs that starts with "Should be ignored", unless they're errors
    {
      matchers: {
        message: '/^Should be ignored/',
      },
      level: 'error',
    },
    // Ignore logs from auth or custom plugins, unless they're errors
    {
      matchers: {
        plugin: ['custom-ignored', 'custom-ignored-secondary'],
      },
      level: 'error',
    },
    // Ignore logs that starts with "Array of regex should be ignored", unless they're errors
    {
      matchers: {
        message: ['/^Array of regex should be ignored/'],
      },
      level: 'error',
    },
    // Ignore specific log from specific-message plugin and with "should be dismissed" message
    {
      matchers: {
        plugin: 'specific-message',
        message: 'Should be dismissed',
      },
      level: 'error',
    },
  ];

  const formatter = createLevelOverridesFormatter(overridesConfig, 'info');

  it('should ignore logs that will be ignored by Winston anyway', () => {
    const log = {
      level: 'debug',
      message: 'debug message',
      plugin: 'catalog',
    };
    expect(formatter.transform(log)).toEqual(false);
  });

  it('should do nothing with logs not matching any override', () => {
    const log = {
      level: 'info',
      message: 'info message',
    };
    expect(formatter.transform(log)).toEqual(log);
  });

  it('should dismiss logs matching simple override', () => {
    const log = {
      level: 'info',
      message: 'info message',
      plugin: 'ignored',
    };
    expect(formatter.transform(log)).toEqual(false);
  });

  it('should dismiss logs matching regex override', () => {
    const log = {
      level: 'info',
      message: 'Should be ignored',
    };
    expect(formatter.transform(log)).toEqual(false);
  });

  it('should dismiss logs from custom plugin', () => {
    const log = {
      level: 'info',
      message: 'message',
      plugin: 'custom-ignored-secondary',
    };
    expect(formatter.transform(log)).toEqual(false);
  });

  it('should dismiss when matching an array of regexes', () => {
    const log = {
      level: 'info',
      message: 'Array of regex should be ignored',
    };
    expect(formatter.transform(log)).toEqual(false);
  });

  it('should dismiss with AND matchers', () => {
    const log = {
      level: 'info',
      plugin: 'specific-message',
      message: 'Should be dismissed',
    };
    expect(formatter.transform(log)).toEqual(false);
  });
});
