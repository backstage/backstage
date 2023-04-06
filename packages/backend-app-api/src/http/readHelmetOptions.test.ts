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

import { ConfigReader } from '@backstage/config';
import { readHelmetOptions } from './readHelmetOptions';

describe('readHelmetOptions', () => {
  it('should return defaults', () => {
    expect(readHelmetOptions()).toEqual({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          'default-src': ["'self'"],
          'base-uri': ["'self'"],
          'font-src': ["'self'", 'https:', 'data:'],
          'frame-ancestors': ["'self'"],
          'img-src': ["'self'", 'data:'],
          'object-src': ["'none'"],
          'script-src': ["'self'", "'unsafe-eval'"],
          'style-src': ["'self'", 'https:', "'unsafe-inline'"],
          'script-src-attr': ["'none'"],
          'upgrade-insecure-requests': [],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      originAgentCluster: false,
    });
  });

  it('should add additional directives', () => {
    const config = new ConfigReader({
      csp: {
        key: ['value'],
        'img-src': false,
        'script-src-attr': ['custom'],
      },
    });
    expect(readHelmetOptions(config)).toEqual({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          'default-src': ["'self'"],
          'base-uri': ["'self'"],
          'font-src': ["'self'", 'https:', 'data:'],
          'frame-ancestors': ["'self'"],
          'object-src': ["'none'"],
          'script-src': ["'self'", "'unsafe-eval'"],
          'style-src': ["'self'", 'https:', "'unsafe-inline'"],
          'script-src-attr': ['custom'],
          'upgrade-insecure-requests': [],
          key: ['value'],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      originAgentCluster: false,
    });
  });

  it('rejects invalid value types', () => {
    const config = new ConfigReader({ csp: { key: [4] } });
    expect(() => readHelmetOptions(config)).toThrow(/wanted string-array/);
  });
});
