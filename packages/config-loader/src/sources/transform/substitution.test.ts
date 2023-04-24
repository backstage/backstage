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

import { createSubstitutionTransform } from './substitution';

const env = jest.fn(async (name: string) => {
  return (
    {
      SECRET: 'my-secret',
      TOKEN: 'my-token',
    } as { [name: string]: string }
  )[name];
});

const substituteTransform = createSubstitutionTransform(env);

describe('substituteTransform', () => {
  it('should not transform unknown values', async () => {
    await expect(substituteTransform(false, { dir: '/' })).resolves.toEqual({
      applied: false,
    });
    await expect(substituteTransform([1], { dir: '/' })).resolves.toEqual({
      applied: false,
    });
    await expect(substituteTransform(1, { dir: '/' })).resolves.toEqual({
      applied: false,
    });
    await expect(
      substituteTransform({ x: 'y' }, { dir: '/' }),
    ).resolves.toEqual({
      applied: false,
    });
    await expect(substituteTransform(null, { dir: '/' })).resolves.toEqual({
      applied: false,
    });
  });

  it('should substitute env var', async () => {
    await expect(
      substituteTransform('hello ${SECRET}', { dir: '/' }),
    ).resolves.toEqual({
      applied: true,
      value: 'hello my-secret',
    });
    await expect(
      substituteTransform('${SECRET      } $${} ${TOKEN }', { dir: '/' }),
    ).resolves.toEqual({ applied: true, value: 'my-secret ${} my-token' });
    await expect(
      substituteTransform('foo ${MISSING}', { dir: '/' }),
    ).resolves.toEqual({
      applied: true,
      value: undefined,
    });
    await expect(
      substituteTransform('empty substitute ${}', { dir: '/' }),
    ).resolves.toEqual({
      applied: true,
      value: undefined,
    });
    await expect(
      substituteTransform('foo ${MISSING} ${SECRET}', { dir: '/' }),
    ).resolves.toEqual({ applied: true, value: undefined });
    await expect(
      substituteTransform('foo ${SECRET} ${SECRET}', { dir: '/' }),
    ).resolves.toEqual({ applied: true, value: 'foo my-secret my-secret' });
    await expect(
      substituteTransform('foo ${SECRET} $$${ESCAPE_ME}', { dir: '/' }),
    ).resolves.toEqual({ applied: true, value: 'foo my-secret $${ESCAPE_ME}' });
    await expect(
      substituteTransform('foo $${ESCAPE_ME} $$${ESCAPE_ME_TOO} $${}', {
        dir: '/',
      }),
    ).resolves.toEqual({
      applied: true,
      value: 'foo ${ESCAPE_ME} $${ESCAPE_ME_TOO} ${}',
    });
  });
});
