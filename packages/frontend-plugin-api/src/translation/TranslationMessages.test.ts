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

import { createTranslationMessages } from './TranslationMessages';
import { createTranslationRef } from './TranslationRef';

const ref = createTranslationRef({
  id: 'counting',
  messages: {
    one: 'one',
    two: 'two',
    three: 'three',
  },
});

describe('createTranslationMessages', () => {
  it('should create a partial message set', () => {
    expect(
      createTranslationMessages({
        ref,
        messages: {
          one: 'uno',
        },
      }),
    ).toEqual({
      $$type: '@backstage/TranslationMessages',
      id: 'counting',
      full: false,
      messages: {
        one: 'uno',
      },
    });
  });

  it('should create a full message set', () => {
    expect(
      createTranslationMessages({
        ref,
        full: true,
        messages: {
          one: 'uno',
          two: 'dos',
          three: null,
        },
      }),
    ).toEqual({
      $$type: '@backstage/TranslationMessages',
      id: 'counting',
      full: true,
      messages: {
        one: 'uno',
        two: 'dos',
        three: null,
      },
    });
  });

  it('should require all messages in a full set', () => {
    expect(
      createTranslationMessages({
        ref,
        full: true,
        // @ts-expect-error
        messages: {
          one: 'uno',
          two: 'dos',
        },
      }),
    ).toEqual({
      $$type: '@backstage/TranslationMessages',
      id: 'counting',
      full: true,
      messages: {
        one: 'uno',
        two: 'dos',
      },
    });
  });
});
