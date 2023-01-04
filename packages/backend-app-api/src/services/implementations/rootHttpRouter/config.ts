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

import { Config } from '@backstage/config';
import { CorsOptions } from 'cors';
import { Minimatch } from 'minimatch';

export type BaseOptions = {
  listenPort?: string | number;
  listenHost?: string;
};

export type HttpsSettings = {
  certificate: CertificateGenerationOptions | CertificateReferenceOptions;
};

export type CertificateReferenceOptions = {
  key: string;
  cert: string;
};

export type CertificateGenerationOptions = {
  hostname: string;
};

export type CertificateAttributes = {
  commonName: string;
};

/**
 * A map from CSP directive names to their values.
 */
export type CspOptions = Record<string, string[]>;

type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[];

type CustomOrigin = (
  requestOrigin: string | undefined,
  callback: (err: Error | null, origin?: StaticOrigin) => void,
) => void;

/**
 * Attempts to read a CORS options object from the root of a config object.
 *
 * @param config - The root of a backend config object
 * @returns A CORS options object, or undefined if not specified
 *
 * @example
 * ```json
 * {
 *   cors: {
 *    origin: "http://localhost:3000",
 *    credentials: true
 *   }
 * }
 * ```
 */
export function readCorsOptions(config: Config): CorsOptions | undefined {
  const cc = config.getOptionalConfig('cors');
  if (!cc) {
    return undefined;
  }

  return removeUnknown({
    origin: createCorsOriginMatcher(getOptionalStringOrStrings(cc, 'origin')),
    methods: getOptionalStringOrStrings(cc, 'methods'),
    allowedHeaders: getOptionalStringOrStrings(cc, 'allowedHeaders'),
    exposedHeaders: getOptionalStringOrStrings(cc, 'exposedHeaders'),
    credentials: cc.getOptionalBoolean('credentials'),
    maxAge: cc.getOptionalNumber('maxAge'),
    preflightContinue: cc.getOptionalBoolean('preflightContinue'),
    optionsSuccessStatus: cc.getOptionalNumber('optionsSuccessStatus'),
  });
}

/**
 * Attempts to read a CSP options object from the root of a config object.
 *
 * @param config - The root of a backend config object
 * @returns A CSP options object, or undefined if not specified. Values can be
 *          false as well, which means to remove the default behavior for that
 *          key.
 *
 * @example
 * ```yaml
 * backend:
 *   csp:
 *     connect-src: ["'self'", 'http:', 'https:']
 *     upgrade-insecure-requests: false
 * ```
 */
export function readCspOptions(
  config: Config,
): Record<string, string[] | false> | undefined {
  const cc = config.getOptionalConfig('csp');
  if (!cc) {
    return undefined;
  }

  const result: Record<string, string[] | false> = {};
  for (const key of cc.keys()) {
    if (cc.get(key) === false) {
      result[key] = false;
    } else {
      result[key] = cc.getStringArray(key);
    }
  }

  return result;
}

function getOptionalStringOrStrings(
  config: Config,
  key: string,
): string | string[] | undefined {
  const value = config.getOptional(key);
  if (value === undefined || isStringOrStrings(value)) {
    return value;
  }
  throw new Error(`Expected string or array of strings, got ${typeof value}`);
}

function createCorsOriginMatcher(
  originValue: string | string[] | undefined,
): CustomOrigin | undefined {
  if (originValue === undefined) {
    return originValue;
  }

  if (!isStringOrStrings(originValue)) {
    throw new Error(
      `Expected string or array of strings, got ${typeof originValue}`,
    );
  }

  const allowedOrigin =
    typeof originValue === 'string' ? [originValue] : originValue;

  const allowedOriginPatterns =
    allowedOrigin?.map(
      pattern => new Minimatch(pattern, { nocase: true, noglobstar: true }),
    ) ?? [];

  return (origin, callback) => {
    return callback(
      null,
      allowedOriginPatterns.some(pattern => pattern.match(origin ?? '')),
    );
  };
}

function isStringOrStrings(value: any): value is string | string[] {
  return typeof value === 'string' || isStringArray(value);
}

function isStringArray(value: any): value is string[] {
  if (!Array.isArray(value)) {
    return false;
  }
  for (const v of value) {
    if (typeof v !== 'string') {
      return false;
    }
  }
  return true;
}

function removeUnknown<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as T;
}
