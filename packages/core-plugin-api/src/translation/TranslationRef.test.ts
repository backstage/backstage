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
  toInternalTranslationRef,
} from './TranslationRef';

describe('TranslationRefImpl', () => {
  it('should create a TranslationRef instance using the factory function', () => {
    const config = {
      id: 'testId',
      messages: { key: 'value' },
    };

    const translationRef = toInternalTranslationRef(
      createTranslationRef(config),
    );

    expect(translationRef.id).toBe('testId');
    expect(translationRef.getDefaultMessages()).toEqual({ key: 'value' });
  });

  it('should get lazy resources', async () => {
    const config = {
      id: 'testId',
      messages: { key: 'value' },
      lazyResources: {
        en: () => Promise.resolve({ messages: { key: 'value' } }),
      },
    };

    const translationRef = toInternalTranslationRef(
      createTranslationRef(config),
    );

    const lazyResources = translationRef.getLazyResources();

    const messages = await lazyResources?.en();

    expect(messages).toEqual({ messages: { key: 'value' } });
  });
});
