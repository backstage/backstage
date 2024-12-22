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
  propsOfHumanDuration,
  readDurationFromConfig,
} from './readDurationFromConfig';
import { ConfigReader } from './reader';

describe('readDurationFromConfig', () => {
  describe('ISO form', () => {
    it('parses the known forms', () => {
      const config = new ConfigReader({
        d1: 'P2DT6H',
        d2: 'PT0.5S',
        d3: 'PT3.1S',
        d4: 'P1Y2M3W4DT5H6M7.8S',
      });

      expect(readDurationFromConfig(config, { key: 'd1' })).toEqual({
        days: 2,
        hours: 6,
      });
      expect(readDurationFromConfig(config, { key: 'd2' })).toEqual({
        milliseconds: 500,
      });
      expect(readDurationFromConfig(config, { key: 'd3' })).toEqual({
        seconds: 3,
        milliseconds: 100,
      });
      expect(readDurationFromConfig(config, { key: 'd4' })).toEqual({
        years: 1,
        months: 2,
        weeks: 3,
        days: 4,
        hours: 5,
        minutes: 6,
        seconds: 7,
        milliseconds: 800,
      });
    });

    it('throws on errors', () => {
      const config = new ConfigReader({
        d1: 'P 1Y',
        d2: 'P1L',
        d3: 'P',
      });

      expect(() =>
        readDurationFromConfig(config, { key: 'd1' }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Invalid duration 'P 1Y' in config at 'd1', Error: Invalid ISO format, expected a value similar to 'P2DT6H' (2 days 6 hours) or 'PT1M' (1 minute)"`,
      );
      expect(() =>
        readDurationFromConfig(config, { key: 'd2' }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Invalid duration 'P1L' in config at 'd2', Error: Invalid ISO format, expected a value similar to 'P2DT6H' (2 days 6 hours) or 'PT1M' (1 minute)"`,
      );
      expect(() =>
        readDurationFromConfig(config, { key: 'd3' }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Invalid duration 'P' in config at 'd3', Error: Invalid ISO format, no values given"`,
      );
    });
  });

  describe('ms form', () => {
    it('parses the known units', () => {
      // this is not exhaustive, but tests all supported units to ensure that
      // our conversion to HumanDuration form works
      const config = new ConfigReader({
        d1: '1y',
        d2: '2 years',
        d3: '4w',
        d4: '5h',
        d5: '6 hrs',
        d6: '7min',
        d7: '9 minutes',
        d8: '3.5 seconds',
        d9: '25 ms',
        d10: '1850ms',
      });

      expect(readDurationFromConfig(config, { key: 'd1' })).toEqual({
        years: 1,
      });
      expect(readDurationFromConfig(config, { key: 'd2' })).toEqual({
        years: 2,
      });
      expect(readDurationFromConfig(config, { key: 'd3' })).toEqual({
        weeks: 4,
      });
      expect(readDurationFromConfig(config, { key: 'd4' })).toEqual({
        hours: 5,
      });
      expect(readDurationFromConfig(config, { key: 'd5' })).toEqual({
        hours: 6,
      });
      expect(readDurationFromConfig(config, { key: 'd6' })).toEqual({
        minutes: 7,
      });
      expect(readDurationFromConfig(config, { key: 'd7' })).toEqual({
        minutes: 9,
      });
      expect(readDurationFromConfig(config, { key: 'd8' })).toEqual({
        seconds: 3,
        milliseconds: 500,
      });
      expect(readDurationFromConfig(config, { key: 'd9' })).toEqual({
        milliseconds: 25,
      });
      expect(readDurationFromConfig(config, { key: 'd10' })).toEqual({
        seconds: 1,
        milliseconds: 850,
      });
    });

    it('throws on errors', () => {
      const config = new ConfigReader({
        d1: '1m 3s',
        d2: '-3s',
        d3: '',
      });

      expect(() =>
        readDurationFromConfig(config, { key: 'd1' }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Invalid duration '1m 3s' in config at 'd1', Error: Not a valid duration string, try a number followed by a unit such as '1d' or '2 seconds'"`,
      );
      expect(() =>
        readDurationFromConfig(config, { key: 'd2' }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Invalid duration '-3s' in config at 'd2', Error: Negative durations are not allowed"`,
      );
      expect(() =>
        readDurationFromConfig(config, { key: 'd3' }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Invalid type in config for key 'd3' in 'mock-config', got empty-string, wanted string"`,
      );
    });
  });

  describe('object form', () => {
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

    it.each(propsOfHumanDuration)(
      'rejects non-number %p, for a subkey',
      prop => {
        const config = new ConfigReader({
          sub: {
            key: {
              [prop]: 'value',
            },
          },
        });
        expect(() =>
          readDurationFromConfig(config, { key: 'sub.key' }),
        ).toThrow(
          `Failed to read duration from config, Error: Unable to convert config value for key 'sub.key.${prop}' in 'mock-config' to a number`,
        );
      },
    );
  });
});
