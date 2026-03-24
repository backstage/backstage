/*
 * Copyright 2024 The Backstage Authors
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

import * as depCommonJs from 'dep-commonjs';
// import * as depModule from 'dep-module';
import * as depDefault from 'dep-default';
import { value as namedA } from './a-named';
// import { value as namedB } from './b-named.mts';
import { value as namedC } from './c-named.cts';
import { default as defaultA } from './a-default';
// import { default as defaultB } from './b-default.mts';
import { default as defaultC } from './c-default.cts';

async function resolveAll(obj: object): Promise<unknown> {
  const val = await obj;
  if (typeof val !== 'object' || val === null) {
    return val;
  }
  if (Array.isArray(val)) {
    return await Promise.all(val.map(resolveAll));
  }
  return Object.fromEntries(
    await Promise.all(
      Object.entries(obj).map(async ([key, value]) => [
        key,
        await resolveAll(await value),
      ]),
    ),
  );
}

export const values = resolveAll({
  depCommonJs,
  // depModule,
  depDefault,
  dynCommonJs: import('dep-commonjs'),
  dynModule: import('dep-module'),
  dynDefault: import('dep-default'),
  dep: {
    namedA,
    // namedB,
    namedC,
    defaultA,
    // defaultB,
    defaultC,
  },
  dyn: {
    // @ts-expect-error Default exports from CommonJS are not well supported
    namedA: import('./a-named').then(m => m.default.value),
    namedB: import('./b-named.mts').then(m => m.value),
    namedC: import('./c-named.cts').then(m => m.value),
    // @ts-expect-error Default exports from CommonJS are not well supported
    defaultA: import('./a-default').then(m => m.default.default),
    defaultB: import('./b-default.mts').then(m => m.default),
    // @ts-expect-error Default exports from CommonJS are not well supported
    defaultC: import('./c-default.cts').then(m => m.default.default),
  },
});
