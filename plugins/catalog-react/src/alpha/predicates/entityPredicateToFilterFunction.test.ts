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

import { entityPredicateToFilterFunction } from './entityPredicateToFilterFunction';
import { EntityPredicate } from './types';

describe('entityPredicateToFilterFunction', () => {
  const entities = [
    {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 's',
        namespace: 'default',
        annotations: {
          'backstage.io/managed-by-location': 'url:service',
          'github.com/repo': 'service',
        },
        tags: ['java', 'spring'],
      },
      spec: {
        type: 'service',
        owner: 'g',
      },
      relations: [
        {
          type: 'ownedBy',
          targetRef: 'group:default/g',
        },
        {
          type: 'providesApi',
          targetRef: 'api:default/a',
        },
      ],
    },
    {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'w',
        namespace: 'default',
        annotations: {
          'backstage.io/managed-by-location': 'url:website',
          'github.com/repo': 'website',
        },
      },
      spec: {
        type: 'website',
        owner: 'g',
      },
      relations: [
        {
          type: 'ownedBy',
          targetRef: 'group:default/g',
        },
        {
          type: 'dependsOn',
          targetRef: 'api:default/a',
        },
      ],
    },
    {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        name: 'g',
        namespace: 'default',
      },
      spec: {
        type: 'squad',
      },
      relations: [
        {
          type: 'ownerOf',
          targetRef: 'component:default/s',
        },
        {
          type: 'ownerOf',
          targetRef: 'component:default/w',
        },
        {
          type: 'ownerOf',
          targetRef: 'component:default/a',
        },
      ],
    },
    {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: {
        name: 'a',
        namespace: 'default',
      },
      spec: {
        type: 'grpc',
        owner: 'g',
        definition: 'mock',
        nothing: null,
        oneNum: 1,
        oneStr: '1',
      },
      relations: [
        {
          type: 'ownedBy',
          targetRef: 'group:default/g',
        },
        {
          type: 'apiProvidedBy',
          targetRef: 'component:default/c',
        },
        {
          type: 'dependencyOf',
          targetRef: 'component:default/w',
        },
      ],
    },
  ];

  it.each([
    ['s', { kind: 'component', 'spec.type': 'service' }],
    ['s', { 'metadata.tags': { $contains: 'java' } }],
    [
      's',
      {
        $all: [
          { 'metadata.tags': { $contains: 'java' } },
          { 'metadata.tags': { $contains: 'spring' } },
        ],
      },
    ],
    ['s', { 'metadata.tags': ['java', 'spring'] }],
    ['', { 1: 'foo' }],
    ['s,w,g,a', {}],
    ['', { kind: { $unknown: 'foo' } }],
    ['', { '': 'component' }],
    ['s,w,g,a', Object.create({ kind: 'component' })],
    ['', { 'metadata.tags': { $contains: 'go' } }],
    ['', { 'metadata.tags.0': 'java' }],
    ['w,g,a', { $not: { 'metadata.tags': { $contains: 'java' } } }],
    [
      's,g',
      {
        $any: [
          { kind: 'component', 'spec.type': 'service' },
          { kind: 'group' },
        ],
      },
    ],
    [
      'w,a',
      {
        $not: {
          $any: [
            { kind: 'component', 'spec.type': 'service' },
            { kind: 'group' },
          ],
        },
      },
    ],
    [
      's,w,a',
      {
        relations: {
          $contains: { type: 'ownedBy', targetRef: 'group:default/g' },
        },
      },
    ],
    [
      '',
      {
        metadata: { $contains: { name: 'a' } },
      },
    ],
    ['', { $unknown: 'ignored' } as unknown as EntityPredicate],
    [
      's,w',
      { kind: 'component', 'spec.type': { $in: ['service', 'website'] } },
    ],
    [
      's,w,a',
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
    ],
    ['s', { kind: 'component', 'spec.type': { $in: ['service'] } }],
    [
      'w',
      {
        $all: [
          { kind: 'component' },
          { $not: { 'spec.type': { $in: ['service'] } } },
        ],
      },
    ],
    ['s,w,a', { 'spec.owner': { $exists: true } }],
    ['g', { 'spec.owner': { $exists: false } }],
    ['s', { 'spec.type': 'service' }],
    ['', { 'spec.nothing': null }],
    ['w,g,a', { $not: { 'spec.type': 'service' } }],
    ['', { 'spec.type': null }],
    ['a', { 'spec.oneNum': 1 }],
    ['a', { 'spec.oneStr': 1 }],
    ['a', { 'spec.oneNum': '1' }],
    ['a', { 'spec.oneStr': '1' }],
    [
      's,w',
      {
        kind: 'component',
        'metadata.annotations.github.com/repo': { $exists: true },
      },
    ],
  ])('filter entry %#', (expected, filter) => {
    const filtered = entities.filter(entity =>
      entityPredicateToFilterFunction(filter)(entity),
    );
    expect(filtered.map(e => e.metadata.name).sort()).toEqual(
      expected.split(',').filter(Boolean).sort(),
    );
  });
});
