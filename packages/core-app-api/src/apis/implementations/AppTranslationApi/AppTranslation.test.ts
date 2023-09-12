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

import { createTranslationRef } from '@backstage/core-plugin-api/alpha';
import { AppTranslationApiImpl } from './AppTranslationImpl';
import i18next from 'i18next';

jest.mock('i18next', () => ({
  createInstance: jest.fn(() => ({
    use: jest.fn(() => ({
      init: jest.fn(),
      use: jest.fn(),
      addResourceBundle: jest.fn(),
      reloadResources: jest.fn(),
      emit: jest.fn(),
      services: {
        languageUtils: {
          getFallbackCodes: jest.fn().mockReturnValue(['en']),
        },
      },
      options: {
        fallbackLng: 'en',
        supportedLngs: ['zh', 'en'],
      },
    })),
  })),
}));

describe('AppTranslationApiImpl', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create i18n instance and init with options', () => {
    const i18nMock = i18next.createInstance() as any;
    const useReturnMock = i18nMock.use();
    jest.spyOn(i18nMock, 'use').mockReturnValue(useReturnMock);
    jest.spyOn(i18next, 'createInstance').mockReturnValue(i18nMock);

    const instance = AppTranslationApiImpl.create({
      supportedLanguages: ['en', 'zh'],
    });

    expect(i18next.createInstance).toHaveBeenCalled();
    expect(i18nMock.use).toHaveBeenCalled();
    expect(useReturnMock.init).toHaveBeenCalledWith({
      fallbackLng: 'en',
      supportedLngs: ['en', 'zh'],
      interpolation: {
        escapeValue: false,
      },
      react: {
        bindI18n: 'loaded languageChanged',
      },
    });
    expect(instance).toBeInstanceOf(AppTranslationApiImpl);
  });

  it('should init messages correctly', () => {
    const useResourcesMock = jest.spyOn(
      AppTranslationApiImpl.prototype,
      'addResources',
    );
    const useLazyResourcesMock = jest.spyOn(
      AppTranslationApiImpl.prototype,
      'addLazyResources',
    );
    const ref = createTranslationRef({
      id: 'ref-id',
      messages: {
        key1: '',
      },
    });

    const options = {
      supportedLanguages: ['en'],
      messages: [
        {
          ref,
          messages: {
            en: { key1: 'value1' },
          },
          lazyMessages: {
            en: () => Promise.resolve({ key2: 'value2' }),
          } as any,
        },
      ],
    };

    const instance = AppTranslationApiImpl.create({
      supportedLanguages: ['en'],
    });
    instance.initMessages(options);

    expect(useResourcesMock).toHaveBeenCalledWith(
      options.messages[0].ref,
      options.messages[0].messages,
    );
    expect(useLazyResourcesMock).toHaveBeenCalledWith(
      options.messages[0].ref,
      options.messages[0].lazyMessages,
    );
  });

  it('should useResources correctly', () => {
    const i18nMock = i18next.createInstance() as any;
    const useReturnMock = i18nMock.use();
    jest.spyOn(i18nMock, 'use').mockReturnValue(useReturnMock);
    jest.spyOn(i18next, 'createInstance').mockReturnValue(i18nMock);

    const ref = createTranslationRef({
      id: 'ref-id',
      messages: {
        key1: 'value1',
      },
      resources: {
        en: {
          key1: 'value2',
        },
      },
    });

    const instance = AppTranslationApiImpl.create({
      supportedLanguages: ['en'],
    });
    instance.addResources(ref);

    expect(useReturnMock.addResourceBundle).toHaveBeenCalledWith(
      'en',
      'ref-id',
      { key1: 'value2' },
      true,
      false,
    );
  });

  it('should useLazyResources correctly', () => {
    const i18nMock = i18next.createInstance() as any;
    const useReturnMock = i18nMock.use();

    jest.spyOn(i18nMock, 'use').mockReturnValue(useReturnMock);
    jest.spyOn(i18next, 'createInstance').mockReturnValue(i18nMock);

    const ref = createTranslationRef({
      id: 'ref-id',
      messages: {
        key1: 'value1',
      },
      lazyResources: {
        en: () => Promise.resolve({ messages: { key1: 'value2' } }),
      },
    });

    const instance = AppTranslationApiImpl.create({
      supportedLanguages: ['en'],
    });
    instance.addLazyResources(ref);
    setTimeout(() => {
      expect(useReturnMock.addResourceBundle).toHaveBeenCalledWith(
        'en',
        'ref-id',
        { key1: 'value2' },
        true,
        false,
      );
    });
  });
});
