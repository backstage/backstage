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

import {
  JsonPrimitive,
  JsonArray,
  JsonObject,
  JsonValue,
  mergeJson,
} from './json';

describe('json', () => {
  it('JsonPrimitive', () => {
    function isValid(..._v: JsonPrimitive[]) {}
    isValid(1, 's', true, false, null);

    // @ts-expect-error
    const v1: JsonPrimitive = [];
    // @ts-expect-error
    const v2: JsonPrimitive = {};

    expect(true).toBe(true);
  });

  it('JsonArray', () => {
    function isValid(..._v: JsonArray[]) {}
    isValid([], [1, 's', true, false, null, {}, []]);

    // @ts-expect-error
    const v1: JsonArray = 1;
    // @ts-expect-error
    const v2: JsonArray = 's';
    // @ts-expect-error
    const v3: JsonArray = true;
    // @ts-expect-error
    const v4: JsonArray = false;
    // @ts-expect-error
    const v5: JsonArray = null;
    // @ts-expect-error
    const v6: JsonArray = {};

    expect(true).toBe(true);
  });

  it('JsonObject', () => {
    function isValid(..._v: JsonObject[]) {}
    isValid(
      {},
      { v1: 1, v2: 's', v3: true, v4: false, v5: null, v6: {}, v7: [] },
    );

    // @ts-expect-error
    const v1: JsonObject = 1;
    // @ts-expect-error
    const v2: JsonObject = 's';
    // @ts-expect-error
    const v3: JsonObject = true;
    // @ts-expect-error
    const v4: JsonObject = false;
    // @ts-expect-error
    const v5: JsonObject = null;
    // @ts-expect-error
    const v6: JsonObject = [];

    expect(true).toBe(true);
  });

  it('JsonValue', () => {
    function isValid(..._v: JsonValue[]) {}
    isValid(1, 's', true, false, null, {}, []);

    expect(true).toBe(true);
  });
});

describe('jsonMerge', () => {
  it('should merge two objects', () => {
    const obj1 = { a: 1, b: 2, c: 3 };
    const obj2 = { b: 4, c: 5, d: 6 };
    const merged = mergeJson(obj1, obj2);
    expect(merged).toEqual({ a: 1, b: 4, c: 5, d: 6 });
  });

  it('should always prefer to merge the values of the second parameter', () => {
    const obj1 = {
      a: 1,
      b: [1, 2, 3],
      c: {
        z: 1,
        y: 2,
        x: 3,
      },
    };
    const obj2 = {
      a: 2,
      b: [2, 4, 6],
      c: {
        z: 2,
        y: 4,
        x: 6,
      },
    };
    const merged = mergeJson(obj1, obj2);
    expect(merged).toEqual(obj2);
  });

  it('should prefer the second argument whenever keys collide', () => {
    const obj1 = {
      a: 1,
      b: [1, 2, 3],
      c: {
        z: 1,
        y: 2,
        x: 3,
      },
    };
    const obj2 = {
      a: 2,
      c: {
        y: 4,
      },
    };
    const merged = mergeJson(obj1, obj2);
    expect(merged).toEqual({
      a: 2,
      b: [1, 2, 3],
      c: {
        z: 1,
        y: 4,
        x: 3,
      },
    });
  });

  it('should merge recursively', () => {
    const obj1 = {
      backend: {
        database: {
          provider: 'sqlite3',
        },
      },
    };
    const obj2 = {
      backend: {
        database: {
          password: 'password123',
        },
      },
    };
    const merged = mergeJson(obj1, obj2);
    expect(merged).toEqual({
      backend: {
        database: {
          provider: 'sqlite3',
          password: 'password123',
        },
      },
    });
  });
});
