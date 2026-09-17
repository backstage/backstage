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

import { JsonPrimitive, JsonArray, JsonObject, JsonValue } from './json';

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
