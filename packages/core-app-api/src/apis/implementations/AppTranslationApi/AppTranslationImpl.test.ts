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

import {
  createTranslationMessages,
  createTranslationRef,
  createTranslationResource,
} from '@backstage/core-plugin-api/alpha';
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
    const addMessagesMock = jest.spyOn(
      AppTranslationApiImpl.prototype,
      'addMessages',
    );
    const addLazyResourcesMock = jest.spyOn(
      AppTranslationApiImpl.prototype,
      'addLazyResources',
    );
    const ref = createTranslationRef({
      id: 'ref-id',
      messages: {
        key: '',
      },
    });

    const overrides = createTranslationMessages({
      ref,
      messages: { key: 'value1' },
    });
    const resource = createTranslationResource({
      ref,
      translations: {
        en: () =>
          Promise.resolve({
            default: {
              key: 'value2',
            },
          }),
      },
    });

    AppTranslationApiImpl.create({
      supportedLanguages: ['en'],
      resources: [overrides, resource],
    });

    expect(addMessagesMock).toHaveBeenCalledWith(overrides);
    expect(addLazyResourcesMock).toHaveBeenCalledWith(resource);
  });

  it('should useResources correctly', () => {
    const addLazyResourcesMock = jest.spyOn(
      AppTranslationApiImpl.prototype,
      'addLazyResources',
    );

    const ref = createTranslationRef({
      id: 'ref-id',
      messages: {
        key1: 'value1',
      },
      translations: {
        en: () => Promise.resolve({ default: { key1: 'value2' } }),
      },
    });

    const instance = AppTranslationApiImpl.create({
      supportedLanguages: ['en'],
    });
    instance.addResource(ref);

    expect(addLazyResourcesMock).toHaveBeenCalledTimes(1);
    expect(addLazyResourcesMock.mock.calls[0][0].id).toBe('ref-id');
  });
});
