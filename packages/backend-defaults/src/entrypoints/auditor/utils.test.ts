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

import { ConfigReader } from '@backstage/config';
import {
  getAuditorSampling,
  getMaxMetaStringLength,
  getRedactMetaKeys,
  getSanitizeRequestQuery,
} from './utils';

function configWith(auditor: object) {
  return new ConfigReader({ backend: { auditor } }, 'mock-config');
}

describe('auditor config readers', () => {
  it('should return defaults when no auditor config is present', () => {
    const config = new ConfigReader({}, 'mock-config');

    expect(getSanitizeRequestQuery(config)).toBe(true);
    expect(getMaxMetaStringLength(config)).toBe(4096);
    expect(getRedactMetaKeys(config)).toEqual([
      'token',
      'password',
      'secret',
      'authorization',
      'cookie',
    ]);
    expect(getAuditorSampling(config)).toEqual({});
  });

  it('should read configured values', () => {
    const config = configWith({
      sanitizeRequestQuery: false,
      maxMetaStringLength: -1,
      redactMetaKeys: ['custom-key'],
      sampling: { low: 0.25, critical: 1 },
    });

    expect(getSanitizeRequestQuery(config)).toBe(false);
    expect(getMaxMetaStringLength(config)).toBe(-1);
    expect(getRedactMetaKeys(config)).toEqual([
      'token',
      'password',
      'secret',
      'authorization',
      'cookie',
      'custom-key',
    ]);
    expect(getAuditorSampling(config)).toEqual({ low: 0.25, critical: 1 });
  });

  it('should throw on an invalid maxMetaStringLength', () => {
    const config = configWith({ maxMetaStringLength: -2 });

    expect(() => getMaxMetaStringLength(config)).toThrow(
      "The configuration value for 'backend.auditor.maxMetaStringLength' was given an invalid value: '-2'. Expected an integer greater than or equal to -1, where -1 disables truncation.",
    );
  });

  it('should throw on a non-integer maxMetaStringLength', () => {
    const config = configWith({ maxMetaStringLength: 1.5 });

    expect(() => getMaxMetaStringLength(config)).toThrow(
      "The configuration value for 'backend.auditor.maxMetaStringLength' was given an invalid value: '1.5'. Expected an integer greater than or equal to -1, where -1 disables truncation.",
    );
  });

  it('should throw on an invalid sampling probability', () => {
    const config = configWith({ sampling: { low: 2 } });

    expect(() => getAuditorSampling(config)).toThrow(
      "The configuration value for 'backend.auditor.sampling.low' was given an invalid value: '2'. Expected a number between 0 and 1.",
    );
  });

  it('should throw on a negative sampling probability', () => {
    const config = configWith({ sampling: { critical: -0.1 } });

    expect(() => getAuditorSampling(config)).toThrow(
      "The configuration value for 'backend.auditor.sampling.critical' was given an invalid value: '-0.1'. Expected a number between 0 and 1, and greater than 0 for critical events.",
    );
  });

  it('should throw on a zero sampling probability for critical events', () => {
    const config = configWith({ sampling: { critical: 0 } });

    expect(() => getAuditorSampling(config)).toThrow(
      "The configuration value for 'backend.auditor.sampling.critical' was given an invalid value: '0'. Expected a number between 0 and 1, and greater than 0 for critical events.",
    );
  });

  it('should throw on invalid shapes for the other readers', () => {
    expect(() =>
      getSanitizeRequestQuery(configWith({ sanitizeRequestQuery: 'invalid' })),
    ).toThrow(
      /Unable to convert config value for key 'backend\.auditor\.sanitizeRequestQuery'[\s\S]*to a boolean/,
    );
    expect(() =>
      getRedactMetaKeys(configWith({ redactMetaKeys: 'password' })),
    ).toThrow(
      /Invalid type in config for key 'backend\.auditor\.redactMetaKeys'[\s\S]*wanted string-array/,
    );
  });
});
