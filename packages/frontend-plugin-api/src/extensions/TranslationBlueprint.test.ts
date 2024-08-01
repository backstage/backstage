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
import { createExtensionTester } from '@backstage/frontend-test-utils';
import {
  createTranslationMessages,
  createTranslationRef,
} from '../translation';
import { TranslationBlueprint } from './TranslationBlueprint';

describe('TranslationBlueprint', () => {
  const translationRef = createTranslationRef({
    id: 'test',
    messages: {
      test: 'test',
    },
  });

  const messages = createTranslationMessages({
    ref: translationRef,
    messages: {
      test: 'test2',
    },
  });

  it('should return an extension instance with sane defaults', () => {
    expect(
      TranslationBlueprint.make({
        params: {
          resource: messages,
        },
      }),
    ).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "attachTo": {
          "id": "app",
          "input": "translations",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "translation",
        "name": undefined,
        "namespace": undefined,
        "output": [
          [Function],
        ],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });

  it('should output a translation data ref', () => {
    const extension = TranslationBlueprint.make({
      params: {
        resource: messages,
      },
    });

    expect(
      createExtensionTester(extension).data(
        TranslationBlueprint.dataRefs.translation,
      ),
    ).toBe(messages);
  });
});
