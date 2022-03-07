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

import { getOrCreateGlobalSingleton } from './globalObject';

const anyGlobal = global as any;

describe('getOrCreateGlobalSingleton', () => {
  beforeEach(() => {
    delete anyGlobal['__@backstage/my-thing__'];
  });

  it('should return an existing value', () => {
    const myThing = {};
    anyGlobal['__@backstage/my-thing__'] = myThing;

    expect(getOrCreateGlobalSingleton('my-thing', () => ({}))).toBe(myThing);
    expect(getOrCreateGlobalSingleton('my-thing', () => ({}))).toBe(myThing);
  });

  it('should should create a new value', () => {
    const myNewThing = {};

    expect(anyGlobal['__@backstage/my-thing__']).toBe(undefined);
    expect(getOrCreateGlobalSingleton('my-thing', () => myNewThing)).toBe(
      myNewThing,
    );
    expect(anyGlobal['__@backstage/my-thing__']).toBe(myNewThing);
    expect(getOrCreateGlobalSingleton('my-thing', () => ({}))).toBe(myNewThing);
  });
});
