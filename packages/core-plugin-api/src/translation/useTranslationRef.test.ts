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
import { renderHook } from '@testing-library/react-hooks';
import { useTranslation } from 'react-i18next';
import { useApi } from '../apis';
import { useTranslationRef } from './useTranslationRef';
import { createTranslationRef } from './TranslationRef';

jest.mock('../apis', () => ({
  ...jest.requireActual('../apis'),
  useApi: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('useTranslationRef', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct t', () => {
    const translationRef = createTranslationRef({
      id: 'ref-id',
      messages: {
        key1: 'default1',
        key2: 'default2',
      },
    });

    const tMock = jest.fn();
    tMock.mockReturnValue('translatedValue');

    const i18nMock = {
      language: 'en',
      t: tMock,
    };

    (useApi as jest.Mock).mockReturnValue({
      addResource: jest.fn(),
    });

    (useTranslation as jest.Mock).mockReturnValue(i18nMock);

    const { result } = renderHook(() => useTranslationRef(translationRef));

    const t = result.current;

    t('key1', { condition: 'v1' });
    expect(tMock).toHaveBeenCalledWith('key1', 'default1', { condition: 'v1' });
    t('key2');
    expect(tMock).toHaveBeenCalledWith('key2', 'default2', undefined);
  });
});
