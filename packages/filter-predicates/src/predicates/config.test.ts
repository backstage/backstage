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

import { ConfigReader } from '@backstage/config';
import {
  readFilterPredicateFromConfig,
  readOptionalFilterPredicateFromConfig,
} from './config';

describe('readFilterPredicateFromConfig', () => {
  it('should read a filter predicate from config', () => {
    const config = new ConfigReader({
      predicate: { kind: 'component', 'spec.type': 'service' },
    });

    const result = readFilterPredicateFromConfig(config, { key: 'predicate' });

    expect(result).toEqual({ kind: 'component', 'spec.type': 'service' });
  });

  it('should read a filter predicate from the root config', () => {
    const config = new ConfigReader({
      kind: 'component',
      'spec.type': 'service',
    });

    const result = readFilterPredicateFromConfig(config);

    expect(result).toEqual({ kind: 'component', 'spec.type': 'service' });
  });

  it('should throw when filter predicate is missing', () => {
    const config = new ConfigReader({});

    expect(() =>
      readFilterPredicateFromConfig(config, { key: 'predicate' }),
    ).toThrow(/predicate/);
  });

  it('should throw when filter predicate is invalid', () => {
    const config = new ConfigReader({
      predicate: { kind: { $invalid: 'foo' } },
    });

    expect(() =>
      readFilterPredicateFromConfig(config, { key: 'predicate' }),
    ).toThrow(/Could not read filter predicate from config at 'predicate':/);
  });
});

describe('readOptionalFilterPredicateFromConfig', () => {
  it('should read a filter predicate from config', () => {
    const config = new ConfigReader({
      predicate: { kind: 'component' },
    });

    const result = readOptionalFilterPredicateFromConfig(config, {
      key: 'predicate',
    });

    expect(result).toEqual({ kind: 'component' });
  });

  it('should return undefined when filter predicate is missing', () => {
    const config = new ConfigReader({});

    const result = readOptionalFilterPredicateFromConfig(config, {
      key: 'predicate',
    });

    expect(result).toBeUndefined();
  });

  it('should throw when filter predicate is invalid', () => {
    const config = new ConfigReader({
      predicate: { kind: { $invalid: 'foo' } },
    });

    expect(() =>
      readOptionalFilterPredicateFromConfig(config, { key: 'predicate' }),
    ).toThrow(/Could not read filter predicate from config at 'predicate':/);
  });

  it('should read complex filter predicates', () => {
    const config = new ConfigReader({
      filter: {
        $any: [{ kind: 'component', 'spec.type': 'service' }, { kind: 'api' }],
      },
    });

    const result = readOptionalFilterPredicateFromConfig(config, {
      key: 'filter',
    });

    expect(result).toEqual({
      $any: [{ kind: 'component', 'spec.type': 'service' }, { kind: 'api' }],
    });
  });
});
