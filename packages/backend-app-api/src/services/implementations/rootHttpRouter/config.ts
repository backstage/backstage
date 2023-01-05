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
