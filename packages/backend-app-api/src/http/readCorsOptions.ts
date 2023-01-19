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
import { CorsOptions } from 'cors';
import { Minimatch } from 'minimatch';

/**
 * Attempts to read a CORS options object from the backend configuration object.
 *
 * @public
 * @param config - The backend configuration object.
 * @returns A CORS options object, or undefined if no cors configuration is present.
 *
 * @example
 * ```ts
 * const corsOptions = readCorsOptions(config.getConfig('backend'));
 * ```
 */
export function readCorsOptions(config?: Config): CorsOptions {
  const cc = config?.getOptionalConfig('cors');
  if (!cc) {
    return { origin: false }; // Disable CORS
  }

  return removeUnknown({
    origin: createCorsOriginMatcher(readStringArray(cc, 'origin')),
    methods: readStringArray(cc, 'methods'),
    allowedHeaders: readStringArray(cc, 'allowedHeaders'),
    exposedHeaders: readStringArray(cc, 'exposedHeaders'),
    credentials: cc.getOptionalBoolean('credentials'),
    maxAge: cc.getOptionalNumber('maxAge'),
    preflightContinue: cc.getOptionalBoolean('preflightContinue'),
    optionsSuccessStatus: cc.getOptionalNumber('optionsSuccessStatus'),
  });
}

function removeUnknown<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as T;
}

function readStringArray(config: Config, key: string): string[] | undefined {
  const value = config.getOptional(key);
  if (typeof value === 'string') {
    return [value];
  } else if (!value) {
    return undefined;
  }
  return config.getStringArray(key);
}

function createCorsOriginMatcher(allowedOriginPatterns: string[] | undefined) {
  if (!allowedOriginPatterns) {
    return undefined;
  }

  const allowedOriginMatchers = allowedOriginPatterns.map(
    pattern => new Minimatch(pattern, { nocase: true, noglobstar: true }),
  );

  return (
    origin: string | undefined,
    callback: (
      err: Error | null,
      origin: boolean | string | RegExp | (boolean | string | RegExp)[],
    ) => void,
  ) => {
    return callback(
      null,
      allowedOriginMatchers.some(pattern => pattern.match(origin ?? '')),
    );
  };
}
