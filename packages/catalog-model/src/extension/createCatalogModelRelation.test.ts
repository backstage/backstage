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

import { createCatalogModelRelation } from './createCatalogModelRelation';

describe('createCatalogModelRelation', () => {
  it('normalizes string kinds to arrays and copies all fields', () => {
    const relation = createCatalogModelRelation({
      fromKind: 'Component',
      toKind: 'Group',
      comment: 'A component is owned by a group or user',
      forward: { type: 'ownedBy', singular: 'owner', plural: 'owners' },
      reverse: { type: 'ownerOf', singular: 'owns', plural: 'owns' },
    });

    expect(relation).toEqual({
      fromKind: ['Component'],
      toKind: ['Group'],
      comment: 'A component is owned by a group or user',
      forward: { type: 'ownedBy', singular: 'owner', plural: 'owners' },
      reverse: { type: 'ownerOf', singular: 'owns', plural: 'owns' },
    });
  });

  it('copies array kinds without mutating the original', () => {
    const fromKind = ['Component', 'Resource'];
    const toKind = ['Group', 'User'];
    const forward = { type: 'ownedBy', singular: 'owner', plural: 'owners' };
    const reverse = { type: 'ownerOf', singular: 'owns', plural: 'owns' };

    const relation = createCatalogModelRelation({
      fromKind,
      toKind,
      comment: 'ownership',
      forward,
      reverse,
    });

    expect(relation.fromKind).toEqual(['Component', 'Resource']);
    expect(relation.toKind).toEqual(['Group', 'User']);
    expect(relation.fromKind).not.toBe(fromKind);
    expect(relation.toKind).not.toBe(toKind);
    expect(relation.forward).not.toBe(forward);
    expect(relation.reverse).not.toBe(reverse);
  });
});
