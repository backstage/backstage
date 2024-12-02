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

import { Config } from '@backstage/config';
import { InputError, stringifyError } from '@backstage/errors';
import { HumanDuration } from '@backstage/types';
import ms from 'ms';

export const propsOfHumanDuration = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
];

/**
 * Reads a duration from config.
 *
 * @public
 * @remarks
 *
 * The supported formats are:
 *
 * - A string in the format of '1d', '2 seconds' etc. as supported by the `ms`
 *   library.
 * - A standard ISO formatted duration string, e.g. 'P2DT6H' or 'PT1M'.
 * - An object with individual units (in plural) as keys, e.g. `{ days: 2, hours: 6 }`.
 *
 * The string forms are naturally only supported if the `options.key` argument
 * is passed, since a `Config` argument always represents an object by its
 * nature.
 *
 * This does not support optionality; if you want to support optional durations,
 * you need to first check the presence of the target with `config.has(...)` and
 * then call this function.
 *
 * @param config - A configuration object
 * @param key - If specified, read the duration from the given subkey under the
 *        config object
 * @returns A duration object
 */
export function readDurationFromConfig(
  config: Config,
  options?: {
    key?: string;
  },
): HumanDuration {
  if (options?.key && typeof config.getOptional(options.key) === 'string') {
    const value = config.getString(options.key).trim();
    try {
      return value.startsWith('P')
        ? parseIsoDuration(value)
        : parseMsDuration(value);
    } catch (error) {
      throw new InputError(
        `Invalid duration '${value}' in config at '${
          options.key
        }', ${stringifyError(error)}`,
      );
    }
  }

  return parseObjectDuration(config, options);
}

/**
 * Parses the object form of durations.
 */
export function parseObjectDuration(
  config: Config,
  options?: {
    key?: string;
  },
): HumanDuration {
  let root: Config;
  let found = false;
  const result: Record<string, number> = {};

  try {
    root = options?.key ? config.getConfig(options.key) : config;
    for (const prop of propsOfHumanDuration) {
      const value = root.getOptionalNumber(prop);
      if (value !== undefined) {
        result[prop] = value;
        found = true;
      }
    }
  } catch (error) {
    // This needs no contextual key prefix since the config reader adds it to
    // its own errors
    throw new InputError(`Failed to read duration from config, ${error}`);
  }

  try {
    if (!found) {
      const good = propsOfHumanDuration.map(p => `'${p}'`).join(', ');
      throw new Error(`Needs one or more of ${good}`);
    }

    const invalidProps = root
      .keys()
      .filter(prop => !propsOfHumanDuration.includes(prop));
    if (invalidProps.length) {
      const what = invalidProps.length === 1 ? 'property' : 'properties';
      const bad = invalidProps.map(p => `'${p}'`).join(', ');
      const good = propsOfHumanDuration.map(p => `'${p}'`).join(', ');
      throw new Error(
        `Unknown ${what} ${bad}; expected one or more of ${good}`,
      );
    }
  } catch (error) {
    // For our own errors, even though we don't know where we are anchored in
    // the config hierarchy, we try to be helpful and at least add the subkey if
    // we have it
    let prefix = 'Failed to read duration from config';
    if (options?.key) {
      prefix += ` at '${options.key}'`;
    }
    throw new Error(`${prefix}, ${error}`);
  }

  return result as HumanDuration;
}

/**
 * Parses friendly string durations like '1d', '2 seconds' etc using the ms
 * library.
 */
export function parseMsDuration(input: string): HumanDuration {
  if (/^\d+$/.exec(input)) {
    // We explicitly disallow the only-digits form of the ms library, because
    // from a configuration perspective it's just confusing to even be able to
    // specify that
    throw new Error(
      `The value cannot be a plain number; try adding a unit like 'ms' or 'seconds'`,
    );
  }

  let milliseconds = ms(input);
  if (!Number.isFinite(milliseconds)) {
    throw new Error(
      `Not a valid duration string, try a number followed by a unit such as '1d' or '2 seconds'`,
    );
  } else if (milliseconds < 0) {
    throw new Error('Negative durations are not allowed');
  } else if (milliseconds === 0) {
    return { milliseconds: 0 };
  }

  // As used by the ms library
  const s = 1000;
  const m = s * 60;
  const h = m * 60;
  const d = h * 24;
  const w = d * 7;
  const y = d * 365.25;

  const result: HumanDuration = {};

  if (milliseconds >= y) {
    const years = Math.floor(milliseconds / y);
    milliseconds -= years * y;
    result.years = years;
  }

  if (milliseconds >= w) {
    const weeks = Math.floor(milliseconds / w);
    milliseconds -= weeks * w;
    result.weeks = weeks;
  }

  if (milliseconds >= d) {
    const days = Math.floor(milliseconds / d);
    milliseconds -= days * d;
    result.days = days;
  }

  if (milliseconds >= h) {
    const hours = Math.floor(milliseconds / h);
    milliseconds -= hours * h;
    result.hours = hours;
  }

  if (milliseconds >= m) {
    const minutes = Math.floor(milliseconds / m);
    milliseconds -= minutes * m;
    result.minutes = minutes;
  }

  if (milliseconds >= s) {
    const seconds = Math.floor(milliseconds / s);
    milliseconds -= seconds * s;
    result.seconds = seconds;
  }

  if (milliseconds > 0) {
    result.milliseconds = milliseconds;
  }

  return result;
}

/**
 * Parses an ISO formatted duration string.
 *
 * Implementation taken from luxon's Duration.fromISO to not force that
 * dependency on everyone.
 */
export function parseIsoDuration(input: string): HumanDuration {
  const match =
    /^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/.exec(
      input,
    );
  if (!match) {
    throw new Error(
      `Invalid ISO format, expected a value similar to 'P2DT6H' (2 days 6 hours) or 'PT1M' (1 minute)`,
    );
  }

  const [
    s,
    yearStr,
    monthStr,
    weekStr,
    dayStr,
    hourStr,
    minuteStr,
    secondStr,
    millisecondsStr,
  ] = match;

  const hasNegativePrefix = s[0] === '-';
  const negativeSeconds = !!secondStr && secondStr[0] === '-';

  const maybeNegate = (num: number | undefined, force = false) =>
    num !== undefined && (force || (num && hasNegativePrefix)) ? -num : num;

  const parseFloating = (value: string) => {
    if (typeof value === 'undefined' || value === null || value === '') {
      return undefined;
    }
    return parseFloat(value);
  };

  const parseMillis = (fraction: string | undefined) => {
    // Return undefined (instead of 0) in these cases, where fraction is not set
    if (
      typeof fraction === 'undefined' ||
      fraction === null ||
      fraction === ''
    ) {
      return undefined;
    }
    const f = parseFloat(`0.${fraction}`) * 1000;
    return Math.floor(f);
  };

  const years = maybeNegate(parseFloating(yearStr));
  const months = maybeNegate(parseFloating(monthStr));
  const weeks = maybeNegate(parseFloating(weekStr));
  const days = maybeNegate(parseFloating(dayStr));
  const hours = maybeNegate(parseFloating(hourStr));
  const minutes = maybeNegate(parseFloating(minuteStr));
  const seconds = maybeNegate(parseFloating(secondStr), secondStr === '-0');
  const milliseconds = maybeNegate(
    parseMillis(millisecondsStr),
    negativeSeconds,
  );

  if (
    years === undefined &&
    months === undefined &&
    weeks === undefined &&
    days === undefined &&
    hours === undefined &&
    minutes === undefined &&
    seconds === undefined &&
    milliseconds === undefined
  ) {
    throw new Error('Invalid ISO format, no values given');
  }

  return {
    ...(years ? { years } : {}),
    ...(months ? { months } : {}),
    ...(weeks ? { weeks } : {}),
    ...(days ? { days } : {}),
    ...(hours ? { hours } : {}),
    ...(minutes ? { minutes } : {}),
    ...(seconds ? { seconds } : {}),
    ...(milliseconds ? { milliseconds } : {}),
  };
}
