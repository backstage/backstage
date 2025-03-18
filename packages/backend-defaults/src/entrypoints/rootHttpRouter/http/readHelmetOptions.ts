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
import helmet from 'helmet';
import { HelmetOptions } from 'helmet';
import kebabCase from 'lodash/kebabCase';

/**
 * Attempts to read Helmet options from the backend configuration object.
 *
 * @public
 * @param config - The backend configuration object.
 * @returns A Helmet options object, or undefined if no Helmet configuration is present.
 *
 * @example
 * ```ts
 * const helmetOptions = readHelmetOptions(config.getConfig('backend'));
 * ```
 */
export function readHelmetOptions(config?: Config): HelmetOptions {
  const cspOptions = readCspDirectives(config);
  return {
    contentSecurityPolicy: {
      useDefaults: false,
      directives: applyCspDirectives(cspOptions),
    },
    // These are all disabled in order to maintain backwards compatibility
    // when bumping helmet v5. We can't enable these by default because
    // there is no way for users to configure them.
    // TODO(Rugvip): We should give control of this setup to consumers
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    originAgentCluster: false,
  };
}

type CspDirectives = Record<string, string[] | false> | undefined;

/**
 * Attempts to read a CSP directives from the backend configuration object.
 *
 * @example
 * ```yaml
 * backend:
 *   csp:
 *     connect-src: ["'self'", 'http:', 'https:']
 *     upgrade-insecure-requests: false
 * ```
 */
function readCspDirectives(config?: Config): CspDirectives {
  const cc = config?.getOptionalConfig('csp');
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

type ContentSecurityPolicyDirectives = Exclude<
  HelmetOptions['contentSecurityPolicy'],
  boolean | undefined
>['directives'];

export function applyCspDirectives(
  directives: CspDirectives,
): ContentSecurityPolicyDirectives {
  const result: ContentSecurityPolicyDirectives =
    helmet.contentSecurityPolicy.getDefaultDirectives();

  // TODO(Rugvip): We currently use non-precompiled AJV for validation in the frontend, which uses eval.
  //               It should be replaced by any other solution that doesn't require unsafe-eval.
  result['script-src'] = ["'self'", "'unsafe-eval'"];

  // TODO(Rugvip): This is removed so that we maintained backwards compatibility
  //               when bumping to helmet v5, we could remove this as well as
  //               skip setting `useDefaults: false` in the future.
  delete result['form-action'];

  if (directives) {
    for (const [key, value] of Object.entries(directives)) {
      const kebabCaseKey = kebabCase(key);
      if (value === false) {
        delete result[kebabCaseKey];
      } else {
        result[kebabCaseKey] = value;
      }
    }
  }

  return result;
}
