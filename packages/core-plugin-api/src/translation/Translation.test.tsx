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

import React, { ReactNode } from 'react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { createTranslationRef } from './TranslationRef';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { I18nextTranslationApi } from '../../../core-app-api/src/apis/implementations/TranslationApi';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppLanguageSelector } from '../../..//core-app-api/src/apis/implementations/AppLanguageApi';
import { TranslationApi, translationApiRef } from '../alpha';
import { ErrorApi, errorApiRef } from '../apis';
import { Translation } from './Translation';

const plainRef = createTranslationRef({
  id: 'plain',
  messages: {
    key1: 'default1',
    key2: 'default2',
    key3: 'default3 {{ name }}',
  },
});

function makeWrapper(
  translationApi: TranslationApi,
  errorApi: ErrorApi = { error$: jest.fn(), post: jest.fn() },
) {
  return ({ children }: { children: ReactNode }) => (
    <TestApiProvider
      apis={[
        [translationApiRef, translationApi],
        [errorApiRef, errorApi],
      ]}
      children={children}
    />
  );
}

describe('Translation', () => {
  it('should show translations of key', async () => {
    const languageApi = AppLanguageSelector.create();
    const translationApi = I18nextTranslationApi.create({ languageApi });
    const Wapper = makeWrapper(translationApi);

    const { getByText } = await renderInTestApp(
      <Wapper>
        <Translation translationRef={plainRef} tKey="key1" />
      </Wapper>,
    );

    expect(getByText('default1')).toBeInTheDocument();
  });

  it('should show translations of key with options', async () => {
    const languageApi = AppLanguageSelector.create();
    const translationApi = I18nextTranslationApi.create({ languageApi });
    const Wapper = makeWrapper(translationApi);

    const { getByText } = await renderInTestApp(
      <Wapper>
        <Translation
          translationRef={plainRef}
          tKey="key3"
          tFunctionOptions={{ name: 'name3' }}
        />
      </Wapper>,
    );

    expect(getByText('default3 name3')).toBeInTheDocument();
  });
});
