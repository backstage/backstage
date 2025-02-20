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
    { kind: 'component', 'spec.type': 'service' },
    { 'metadata.tags': { $all: ['java'] } },
    { 'metadata.tags': { $all: ['java', 'spring'] } },
    { 'metadata.tags': ['java', 'spring'] },
    { 'metadata.tags': { $all: ['go'] } },
    { 'metadata.tags.0': 'java' },
    { $not: { 'metadata.tags': { $all: ['java'] } } },
    {
      $or: [{ kind: 'component', 'spec.type': 'service' }, { kind: 'group' }],
    },
    {
      $nor: [{ kind: 'component', 'spec.type': 'service' }, { kind: 'group' }],
    },
    {
      relations: {
        $elemMatch: { type: 'ownedBy', targetRef: 'group:default/g' },
      },
    },
    {
      metadata: { $elemMatch: { name: 'a' } },
    },
    { kind: 'component', 'spec.type': { $in: ['service', 'website'] } },
    {
      $or: [
        {
          $and: [
            {
              kind: 'component',
              'spec.type': { $in: ['service', 'website'] },
            },
          ],
        },
        { $and: [{ kind: 'api', 'spec.type': 'grpc' }] },
      ],
    },
    { kind: 'component', 'spec.type': { $in: ['service'] } },
    { kind: 'component', 'spec.type': { $nin: ['service'] } },
    { 'spec.owner': { $exists: true } },
    { 'spec.owner': { $exists: false } },
    { 'spec.type': { $eq: 'service' } },
    { 'spec.type': { $ne: 'service' } },
    {
      kind: 'component',
      'metadata.annotations.github.com/repo': { $exists: true },
    },
    { $and: [{ x: { $exists: true } }] },
    { $or: [{ x: { $exists: true } }] },
    { $nor: [{ x: { $exists: true } }] },
    { $not: { x: { $exists: true } } },
    { $not: { $and: [{ x: { $exists: true } }] } },
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
    'string',
    '',
    [],
    1,
    { $and: [{ x: { $unknown: true } }] },
    { $or: [{ x: { $unknown: true } }] },
    { $nor: [{ x: { $unknown: true } }] },
    { $not: { x: { $unknown: true } } },
    { $not: { $and: [{ x: { $unknown: true } }] } },
    { $unknown: 'foo' },
  ])('should reject invalid predicate %j', predicate => {
    const result = schema.safeParse(predicate);
    expect(result.success).toBe(false);
  });
});
