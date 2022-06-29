/*
 * Copyright 2022 The Backstage Authors
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

import { UserEntity, GroupEntity } from '../../kinds';
import { GroupDefaultParentEntityPolicy } from './GroupDefaultParentEntityPolicy';

describe('GroupDefaultParentEntityPolicy', () => {
  it('should ignore non-group entities', async () => {
    const p = new GroupDefaultParentEntityPolicy('name');
    const u: UserEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: { name: 'n' },
      spec: { profile: {}, memberOf: ['c'] },
    };
    const result = await p.enforce(u);
    expect(result).toEqual({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: { name: 'n' },
      spec: { profile: {}, memberOf: ['c'] },
    });
  });

  it('should parent group entities', async () => {
    const p = new GroupDefaultParentEntityPolicy('name');
    const g: GroupEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: { name: 'n' },
      spec: { type: 'foo', children: [] },
    };
    const result = await p.enforce(g);
    expect(result).toEqual({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: { name: 'n' },
      spec: { type: 'foo', parent: 'group:default/name', children: [] },
    });
  });

  it('should not replace existing parents', async () => {
    const p = new GroupDefaultParentEntityPolicy('namespace/name');
    const g: GroupEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: { name: 'n' },
      spec: { type: 'foo', parent: 'group:something/else', children: [] },
    };
    const result = await p.enforce(g);
    expect(result).toEqual({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: { name: 'n' },
      spec: { type: 'foo', parent: 'group:something/else', children: [] },
    });
  });
});
