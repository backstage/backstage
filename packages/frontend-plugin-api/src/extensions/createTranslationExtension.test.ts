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
  createTranslationRef,
  createTranslationMessages,
  createTranslationResource,
} from '@backstage/core-plugin-api/alpha';
import { createTranslationExtension } from './createTranslationExtension';

const translationRef = createTranslationRef({
  id: 'test',
  messages: {
    a: 'a',
    b: 'b',
  },
});

describe('createTranslationExtension', () => {
  it('creates a translation message extension', () => {
    const messages = createTranslationMessages({
      ref: translationRef,
      messages: {
        a: 'A',
      },
    });
    const extension = createTranslationExtension({ resource: messages });

    expect(extension).toEqual({
      $$type: '@backstage/ExtensionDefinition',
      version: 'v1',
      kind: 'translation',
      namespace: 'test',
      attachTo: { id: 'app', input: 'translations' },
      disabled: false,
      inputs: {},
      output: {
        resource: createTranslationExtension.translationDataRef,
      },
      factory: expect.any(Function),
      toString: expect.any(Function),
    });

    expect((extension as any).factory({} as any)).toEqual({
      resource: messages,
    });
  });

  it('creates a translation resource extension', () => {
    const resource = createTranslationResource({
      ref: translationRef,
      translations: {
        sv: () =>
          Promise.resolve({
            default: createTranslationMessages({
              ref: translationRef,
              messages: {
                a: 'Ä',
                b: 'Ö',
              },
            }),
          }),
      },
    });
    const extension = createTranslationExtension({ resource });

    expect(extension).toEqual({
      $$type: '@backstage/ExtensionDefinition',
      version: 'v1',
      kind: 'translation',
      namespace: 'test',
      attachTo: { id: 'app', input: 'translations' },
      disabled: false,
      inputs: {},
      output: {
        resource: createTranslationExtension.translationDataRef,
      },
      factory: expect.any(Function),
      toString: expect.any(Function),
    });

    expect((extension as any).factory({} as any)).toEqual({ resource });
  });

  it('creates a translation resource extension with a name', () => {
    expect(
      createTranslationExtension({
        name: 'sv',
        resource: createTranslationResource({
          ref: translationRef,
          translations: {
            sv: () =>
              Promise.resolve({
                default: createTranslationMessages({
                  ref: translationRef,
                  messages: {
                    a: 'Ä',
                    b: 'Ö',
                  },
                }),
              }),
          },
        }),
      }),
    ).toEqual({
      $$type: '@backstage/ExtensionDefinition',
      version: 'v1',
      kind: 'translation',
      namespace: 'test',
      name: 'sv',
      attachTo: { id: 'app', input: 'translations' },
      disabled: false,
      inputs: {},
      output: {
        resource: createTranslationExtension.translationDataRef,
      },
      factory: expect.any(Function),
      toString: expect.any(Function),
    });
  });
});
