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

// @ts-nocheck

import * as depCommonJs from 'dep-commonjs';
import * as depModule from 'dep-module';
import * as depDefault from 'dep-default';
import { value as namedA } from './a-named-explicit';
import { value as namedB } from './b-named';
import cNamed from './c-named';
import defaultA from './a-default-explicit';
import defaultB from './b-default';
import cDefault from './c-default';

const { default: defaultC } = cDefault;
const { value: namedC } = cNamed;

async function resolveAll(obj): Promise<unknown> {
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
  depModule,
  depDefault,
  dynCommonJs: import('dep-commonjs'),
  dynModule: import('dep-module'),
  dynDefault: import('dep-default'),
  dep: {
    namedA,
    namedB,
    namedC,
    defaultA,
    defaultB,
    defaultC,
  },
  dyn: {
    namedA: import('./a-named-explicit').then(m => m.value),
    namedB: import('./b-named').then(m => m.value),
    namedC: import('./c-named').then(m => m.default.value),
    defaultA: import('./a-default-explicit').then(m => m.default),
    defaultB: import('./b-default').then(m => m.default),
    defaultC: import('./c-default').then(m => m.default.default),
  },
});
