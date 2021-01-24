/*
 * Copyright 2020 Spotify AB
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

import { createSubstitutionTransform } from './substitution';

const env = jest.fn(async (name: string) => {
  return ({
    SECRET: 'my-secret',
    TOKEN: 'my-token',
  } as { [name: string]: string })[name];
});

const substituteTransform = createSubstitutionTransform(env);

describe('substituteTransform', () => {
  it('should not transform unknown values', async () => {
    await expect(substituteTransform(false)).resolves.toEqual([
      false,
      expect.anything(),
    ]);
    await expect(substituteTransform([1])).resolves.toEqual([
      false,
      expect.anything(),
    ]);
    await expect(substituteTransform(1)).resolves.toEqual([
      false,
      expect.anything(),
    ]);
    await expect(substituteTransform({ x: 'y' })).resolves.toEqual([
      false,
      expect.anything(),
    ]);
    await expect(substituteTransform(null)).resolves.toEqual([false, null]);
  });

  it('should substitute env var', async () => {
    await expect(substituteTransform('hello ${SECRET}')).resolves.toEqual([
      true,
      'hello my-secret',
    ]);
    await expect(
      substituteTransform('${SECRET      } $${} ${TOKEN }'),
    ).resolves.toEqual([true, 'my-secret $${} my-token']);
    await expect(substituteTransform('foo ${MISSING}')).resolves.toEqual([
      true,
      undefined,
    ]);
    await expect(
      substituteTransform('foo ${MISSING} ${SECRET}'),
    ).resolves.toEqual([true, undefined]);
    await expect(
      substituteTransform('foo ${SECRET} ${SECRET}'),
    ).resolves.toEqual([true, 'foo my-secret my-secret']);
  });
});
