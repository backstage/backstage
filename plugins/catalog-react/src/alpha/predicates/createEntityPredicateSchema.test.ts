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

import { z } from 'zod';
import { createEntityPredicateSchema } from './createEntityPredicateSchema';

describe('createEntityPredicateSchema', () => {
  const schema = createEntityPredicateSchema(z);

  it.each([
    'string',
    '',
    [],
    1,
    { kind: 'component', 'spec.type': 'service' },
    { 'metadata.tags': { $in: ['java'] } },
    {
      $all: [
        { 'metadata.tags': { $contains: 'java' } },
        { 'metadata.tags': { $contains: 'spring' } },
      ],
    },
    { 'metadata.tags': ['java', 'spring'] },
    { 'metadata.tags': { $in: ['go'] } },
    { 'metadata.tags.0': 'java' },
    { $not: { 'metadata.tags': { $in: ['java'] } } },
    {
      $any: [{ kind: 'component', 'spec.type': 'service' }, { kind: 'group' }],
    },
    {
      relations: {
        $contains: { type: 'ownedBy', targetRef: 'group:default/g' },
      },
    },
    {
      metadata: { $contains: { name: 'a' } },
    },
    { kind: 'component', 'spec.type': { $in: ['service', 'website'] } },
    {
      $any: [
        {
          $all: [
            {
              kind: 'component',
              'spec.type': { $in: ['service', 'website'] },
            },
          ],
        },
        { $all: [{ kind: 'api', 'spec.type': 'grpc' }] },
      ],
    },
    { kind: 'component', 'spec.type': { $in: ['service'] } },
    { 'spec.owner': { $exists: true } },
    { 'spec.owner': { $exists: false } },
    { 'spec.type': 'service' },
    { $not: { 'spec.type': 'service' } },
    {
      kind: 'component',
      'metadata.annotations.github.com/repo': { $exists: true },
    },
    { $all: [{ x: { $exists: true } }] },
    { $any: [{ x: { $exists: true } }] },
    { $not: { x: { $exists: true } } },
    { $not: { $all: [{ x: { $exists: true } }] } },
  ])('should accept valid predicate %j', predicate => {
    expect(schema.parse(predicate)).toEqual(predicate);
  });

  it.each([
    { kind: { 1: 'foo' } },
    { kind: { foo: 'bar' } },
    { kind: { $unknown: 'foo' } },
    { kind: { $in: 'foo' } },
    { kind: { $in: [{ x: 'foo' }] } },
    { kind: { $in: [{ x: 'foo' }] } },
    { 'spec.type': null },
    { $all: [{ x: { $unknown: true } }] },
    { $any: [{ x: { $unknown: true } }] },
    { $not: { x: { $unknown: true } } },
    { $not: { $all: [{ x: { $unknown: true } }] } },
    { $unknown: 'foo' },
  ])('should reject invalid predicate %j', predicate => {
    const result = schema.safeParse(predicate);
    expect(result.success).toBe(false);
  });
});
