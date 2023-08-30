/*
 * Copyright 2023 The Backstage Authors
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

import {
  readDurationFromConfig,
  propsOfHumanDuration,
} from './readDurationFromConfig';
import { ConfigReader } from './reader';

describe('readDurationFromConfig', () => {
  it('reads all known keys', () => {
    const config = new ConfigReader({
      milliseconds: 1,
      seconds: 2,
      minutes: 3,
      hours: 4,
      days: 5,
      weeks: 6,
      months: 7,
      years: 8,
    });
    expect(readDurationFromConfig(config)).toEqual({
      milliseconds: 1,
      seconds: 2,
      minutes: 3,
      hours: 4,
      days: 5,
      weeks: 6,
      months: 7,
      years: 8,
    });
  });

  it('reads all known keys, for a subkey', () => {
    const config = new ConfigReader({
      sub: {
        key: {
          milliseconds: 1,
          seconds: 2,
          minutes: 3,
          hours: 4,
          days: 5,
          weeks: 6,
          months: 7,
          years: 8,
        },
      },
    });
    expect(readDurationFromConfig(config, { key: 'sub.key' })).toEqual({
      milliseconds: 1,
      seconds: 2,
      minutes: 3,
      hours: 4,
      days: 5,
      weeks: 6,
      months: 7,
      years: 8,
    });
  });

  it('rejects wrong type of target, for a subkey', () => {
    const config = new ConfigReader({
      sub: { key: 7 },
    });
    expect(() => readDurationFromConfig(config, { key: 'sub.key' })).toThrow(
      "Failed to read duration from config, TypeError: Invalid type in config for key 'sub.key' in 'mock-config', got number, wanted object",
    );
  });

  it('rejects no keys', () => {
    const config = new ConfigReader({});
    expect(() => readDurationFromConfig(config)).toThrow(
      `Failed to read duration from config, Error: Needs one or more of 'years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'`,
    );
  });

  it('rejects no keys, for a subkey', () => {
    const config = new ConfigReader({ sub: { key: {} } });
    expect(() => readDurationFromConfig(config, { key: 'sub.key' })).toThrow(
      `Failed to read duration from config at 'sub.key', Error: Needs one or more of 'years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'`,
    );
  });

  it('rejects unknown keys', () => {
    const config = new ConfigReader({
      minutes: 3,
      invalid: 'value',
    });
    expect(() => readDurationFromConfig(config)).toThrow(
      `Failed to read duration from config, Error: Unknown property 'invalid'; expected one or more of 'years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'`,
    );
  });

  it.each(propsOfHumanDuration)('rejects non-number %p', prop => {
    const config = new ConfigReader({
      [prop]: 'value',
    });
    expect(() => readDurationFromConfig(config)).toThrow(
      `Failed to read duration from config, Error: Unable to convert config value for key '${prop}' in 'mock-config' to a number`,
    );
  });

  it.each(propsOfHumanDuration)('rejects non-number %p, for a subkey', prop => {
    const config = new ConfigReader({
      sub: {
        key: {
          [prop]: 'value',
        },
      },
    });
    expect(() => readDurationFromConfig(config, { key: 'sub.key' })).toThrow(
      `Failed to read duration from config, Error: Unable to convert config value for key 'sub.key.${prop}' in 'mock-config' to a number`,
    );
  });
});
