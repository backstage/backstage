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

import { entityRefCandidates } from './entityRefCandidates';

describe('entityRefCandidates', () => {
  it('offers each permitted kind without silently preferring the default', () => {
    expect(
      entityRefCandidates('freben', {
        catalogFilter: { kind: ['User', 'Group'] },
        defaultKind: 'Group',
      }),
    ).toEqual(['user:default/freben', 'group:default/freben']);
    expect(
      entityRefCandidates('User:other/Freben', {
        catalogFilter: [{ kind: 'Group' }, { kind: 'User' }],
      }),
    ).toEqual(['user:other/freben']);
    expect(
      entityRefCandidates('Component:default/freben', {
        catalogFilter: { kind: ['User', 'Group'] },
      }),
    ).toEqual([]);
  });

  it('requires a kind when it cannot infer a finite set, and validates all ref parts', () => {
    expect(entityRefCandidates('freben', {})).toEqual([]);
    expect(
      entityRefCandidates('freben', {
        defaultKind: 'User',
        defaultNamespace: 'staff',
      }),
    ).toEqual(['user:staff/freben']);
    for (const input of [
      '',
      'Fredrik Adelöw',
      'user:',
      'user:default/',
      'user:a/b/c',
      'invalid kind:name',
    ]) {
      expect(entityRefCandidates(input, { defaultKind: 'User' })).toEqual([]);
    }
    expect(entityRefCandidates('user:default/freben', {})).toEqual([
      'user:default/freben',
    ]);
    // An unconstrained OR branch must not accidentally restrict explicit kinds.
    expect(
      entityRefCandidates('user:default/freben', {
        catalogFilter: [{ kind: 'Group' }, { 'spec.type': 'team' }],
      }),
    ).toEqual(['user:default/freben']);
  });
});
