/*
 * Copyright 2021 The Backstage Authors
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

import { MockStarredEntitiesApi } from './MockStarredEntitiesApi';

describe('MockStarredEntitiesApi', () => {
  it('should toggle starred entities', async () => {
    const api = new MockStarredEntitiesApi();

    const updates1 = new Array<Set<string>>();
    const sub1 = api
      .starredEntitie$()
      .subscribe(entities => updates1.push(entities));

    api.toggleStarred('k:ns/e1');
    api.toggleStarred('k:ns/e2');

    await Promise.resolve();
    expect(updates1).toEqual([
      new Set(),
      new Set(['k:ns/e1']),
      new Set(['k:ns/e1', 'k:ns/e2']),
    ]);

    const updates2 = new Array<Set<string>>();
    const sub2 = api
      .starredEntitie$()
      .subscribe(entities => updates2.push(entities));

    api.toggleStarred('k:ns/e2');
    sub1.unsubscribe();
    api.toggleStarred('k:ns/e2');

    await Promise.resolve();
    expect(updates1).toEqual([
      new Set(),
      new Set(['k:ns/e1']),
      new Set(['k:ns/e1', 'k:ns/e2']),
      new Set(['k:ns/e1']),
    ]);
    expect(updates2).toEqual([
      new Set(['k:ns/e1', 'k:ns/e2']),
      new Set(['k:ns/e1']),
      new Set(['k:ns/e1', 'k:ns/e2']),
    ]);
    sub2.unsubscribe();
  });
});
