/*
 * Copyright 2024 The Backstage Authors
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

import { convertEntityFilterToPredicate } from './convertEntityFilterToPredicate';
import { EntityFilter } from '@backstage/plugin-catalog-node';

describe('convertEntityFilterToPredicate', () => {
  it('converts simple key-value filter', () => {
    const filter: EntityFilter = {
      key: 'kind',
      values: ['component'],
    };

    expect(convertEntityFilterToPredicate(filter)).toEqual({
      kind: 'component',
    });
  });

  it('converts key with multiple values to $in', () => {
    const filter: EntityFilter = {
      key: 'spec.type',
      values: ['service', 'website'],
    };

    expect(convertEntityFilterToPredicate(filter)).toEqual({
      'spec.type': { $in: ['service', 'website'] },
    });
  });

  it('converts key without values to $exists', () => {
    const filter: EntityFilter = {
      key: 'metadata.tags',
    };

    expect(convertEntityFilterToPredicate(filter)).toEqual({
      'metadata.tags': { $exists: true },
    });
  });

  it('converts allOf to $all', () => {
    const filter: EntityFilter = {
      allOf: [
        { key: 'kind', values: ['component'] },
        { key: 'spec.type', values: ['service'] },
      ],
    };

    expect(convertEntityFilterToPredicate(filter)).toEqual({
      $all: [{ kind: 'component' }, { 'spec.type': 'service' }],
    });
  });

  it('converts anyOf to $any', () => {
    const filter: EntityFilter = {
      anyOf: [
        { key: 'spec.owner', values: ['team-a'] },
        { key: 'spec.owner', values: ['team-b'] },
      ],
    };

    expect(convertEntityFilterToPredicate(filter)).toEqual({
      $any: [{ 'spec.owner': 'team-a' }, { 'spec.owner': 'team-b' }],
    });
  });

  it('converts not to $not', () => {
    const filter: EntityFilter = {
      not: { key: 'spec.lifecycle', values: ['experimental'] },
    };

    expect(convertEntityFilterToPredicate(filter)).toEqual({
      $not: { 'spec.lifecycle': 'experimental' },
    });
  });

  it('converts nested complex filters', () => {
    const filter: EntityFilter = {
      allOf: [
        { key: 'kind', values: ['component'] },
        {
          anyOf: [
            { key: 'spec.type', values: ['service'] },
            { key: 'spec.type', values: ['website'] },
          ],
        },
        {
          not: { key: 'spec.lifecycle', values: ['experimental'] },
        },
      ],
    };

    expect(convertEntityFilterToPredicate(filter)).toEqual({
      $all: [
        { kind: 'component' },
        {
          $any: [{ 'spec.type': 'service' }, { 'spec.type': 'website' }],
        },
        {
          $not: { 'spec.lifecycle': 'experimental' },
        },
      ],
    });
  });

  it('handles empty values array as $exists', () => {
    const filter: EntityFilter = {
      key: 'metadata.annotations',
      values: [],
    };

    expect(convertEntityFilterToPredicate(filter)).toEqual({
      'metadata.annotations': { $exists: true },
    });
  });
});
