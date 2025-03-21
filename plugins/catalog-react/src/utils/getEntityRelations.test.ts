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

import { getEntityRelations } from './getEntityRelations';
import {
  Entity,
  RELATION_CHILD_OF,
  RELATION_MEMBER_OF,
} from '@backstage/catalog-model';

describe('getEntityRelations', () => {
  it('should handle undefined value', () => {
    expect(getEntityRelations(undefined, RELATION_MEMBER_OF)).toEqual([]);
  });

  it('should extract correct relation', () => {
    const entity = {
      relations: [
        {
          type: RELATION_MEMBER_OF,
          targetRef: 'group:default/member',
        },
        {
          type: RELATION_CHILD_OF,
          targetRef: 'group:default/child',
          target: { kind: 'group', namespace: 'default', name: 'child' },
        },
      ],
    } as Entity;

    expect(getEntityRelations(entity, RELATION_MEMBER_OF)).toEqual([
      { kind: 'group', namespace: 'default', name: 'member' },
    ]);
  });

  it('should filter relation by type', () => {
    const entity = {
      relations: [
        {
          type: RELATION_MEMBER_OF,
          targetRef: 'group:default/member',
        },
        {
          type: RELATION_MEMBER_OF,
          targetRef: 'user:default/child',
          target: { kind: 'user', namespace: 'default', name: 'child' },
        },
      ],
    } as Entity;

    expect(
      getEntityRelations(entity, RELATION_MEMBER_OF, { kind: 'Group' }),
    ).toEqual([{ kind: 'group', namespace: 'default', name: 'member' }]);
  });
});
