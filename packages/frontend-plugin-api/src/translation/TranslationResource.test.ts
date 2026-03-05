/*
 * Copyright 2023 The Backstage Authors
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
  createTranslationResource,
  toInternalTranslationResource,
} from './TranslationResource';
import { countingTranslationRef } from './__fixtures__/refs';

describe('createTranslationResource', () => {
  it('should create a simple resource', async () => {
    const resource = createTranslationResource({
      ref: countingTranslationRef,
      translations: {
        sv: () =>
          Promise.resolve({
            default: {
              one: 'ett',
              two: 'två',
              three: 'tre',
            },
          }),
      },
    });
    expect(toInternalTranslationResource(resource)).toEqual({
      $$type: '@backstage/TranslationResource',
      version: 'v1',
      id: 'counting',
      resources: [
        {
          language: 'sv',
          loader: expect.any(Function),
        },
      ],
    });
    await expect(
      toInternalTranslationResource(resource).resources[0].loader(),
    ).resolves.toEqual({
      messages: {
        one: 'ett',
        two: 'två',
        three: 'tre',
      },
    });
  });

  it('should create a resource with lazy loaded messages', async () => {
    const resource = createTranslationResource({
      ref: countingTranslationRef,
      translations: {
        de: () => import('./__fixtures__/counting-de'),
        sv: () => import('./__fixtures__/counting-sv.json'),
        // @ts-expect-error
        deBad: () => import('./__fixtures__/fruits-de.json'),
        // @ts-expect-error
        svBad: () => import('./__fixtures__/fruits-sv'),
      },
    });
    expect(toInternalTranslationResource(resource)).toEqual({
      $$type: '@backstage/TranslationResource',
      version: 'v1',
      id: 'counting',
      resources: [
        {
          language: 'de',
          loader: expect.any(Function),
        },
        {
          language: 'sv',
          loader: expect.any(Function),
        },
        {
          language: 'deBad',
          loader: expect.any(Function),
        },
        {
          language: 'svBad',
          loader: expect.any(Function),
        },
      ],
    });

    await expect(
      toInternalTranslationResource(resource).resources[0].loader(),
    ).resolves.toEqual({
      messages: {
        one: 'eins',
        two: 'zwei',
        three: 'polizei',
      },
    });

    await expect(
      toInternalTranslationResource(resource).resources[1].loader(),
    ).resolves.toEqual({
      messages: {
        one: 'ett',
        two: 'två',
        three: 'tre',
      },
    });
  });
});
