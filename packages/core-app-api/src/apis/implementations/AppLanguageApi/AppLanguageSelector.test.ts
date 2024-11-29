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

import { AppLanguageSelector } from './AppLanguageSelector';

const baseOptions = {
  availableLanguages: ['en', 'de'],
};

describe('AppLanguageSelector', () => {
  beforeEach(() => {
    localStorage.removeItem('language');
  });

  it('should select language', async () => {
    const selector = AppLanguageSelector.create(baseOptions);

    expect(selector.getAvailableLanguages()).toEqual({
      languages: ['en', 'de'],
    });

    const subFn = jest.fn();
    selector.language$().subscribe(subFn);
    expect(selector.getLanguage()).toEqual({ language: 'en' });
    await 'wait a tick';
    expect(subFn).toHaveBeenLastCalledWith({ language: 'en' });

    selector.setLanguage('de');
    expect(subFn).toHaveBeenLastCalledWith({ language: 'de' });
    expect(selector.getLanguage()).toEqual({ language: 'de' });

    selector.setLanguage('en');
    expect(subFn).toHaveBeenLastCalledWith({ language: 'en' });
    expect(selector.getLanguage()).toEqual({ language: 'en' });
  });

  it('should return a new array of languages', () => {
    const languages = ['en', 'de'];
    const selector = AppLanguageSelector.create({
      availableLanguages: languages,
    });

    expect(selector.getAvailableLanguages().languages).toEqual(languages);
    expect(selector.getAvailableLanguages().languages).not.toBe(languages);
    expect(selector.getAvailableLanguages().languages).toEqual(
      selector.getAvailableLanguages().languages,
    );
    expect(selector.getAvailableLanguages().languages).not.toBe(
      selector.getAvailableLanguages().languages,
    );
  });

  it('should skip duplicates', async () => {
    const languages = ['en', 'de'];
    const selector = AppLanguageSelector.create({
      availableLanguages: languages,
    });

    const emitted = new Array<string>();
    selector.language$().subscribe(({ language }) => {
      emitted.push(language);
    });
    selector.setLanguage('en');
    selector.setLanguage('en');
    selector.setLanguage('de');
    selector.setLanguage('de');
    selector.setLanguage('de');
    selector.setLanguage('en');
    selector.setLanguage('en');
    selector.setLanguage('en');
    await 'wait a tick';

    expect(emitted).toEqual(['en', 'de', 'en']);
  });

  it('should be initialized from storage', () => {
    expect(
      AppLanguageSelector.createWithStorage(baseOptions).getLanguage(),
    ).toEqual({ language: 'en' });

    localStorage.setItem('language', 'de');

    expect(
      AppLanguageSelector.createWithStorage(baseOptions).getLanguage(),
    ).toEqual({ language: 'de' });

    localStorage.removeItem('language');

    expect(
      AppLanguageSelector.createWithStorage(baseOptions).getLanguage(),
    ).toEqual({ language: 'en' });
  });

  it('should sync with storage', async () => {
    const addListenerSpy = jest.spyOn(window, 'addEventListener');
    const selector = AppLanguageSelector.createWithStorage(baseOptions);

    expect(addListenerSpy).toHaveBeenCalledTimes(1);
    expect(addListenerSpy).toHaveBeenCalledWith(
      'storage',
      expect.any(Function),
    );

    selector.setLanguage('de');
    await 'wait a tick';
    expect(localStorage.getItem('language')).toBe('de');

    selector.setLanguage('en');
    await 'wait a tick';
    expect(localStorage.getItem('language')).toBe('en');

    localStorage.setItem('language', 'de');
    expect(selector.getLanguage()).toEqual({ language: 'en' });

    const listener = addListenerSpy.mock.calls[0][1] as EventListener;
    listener({ key: 'language' } as StorageEvent);

    expect(selector.getLanguage()).toEqual({ language: 'de' });
  });

  it('should reject invalid input', async () => {
    expect(() =>
      AppLanguageSelector.createWithStorage({
        availableLanguages: ['en', 'de', 'en'],
      }),
    ).toThrow(
      "Supported languages may not contain duplicates, got 'en', 'de', 'en'",
    );

    expect(() =>
      AppLanguageSelector.createWithStorage({
        availableLanguages: ['de'],
      }),
    ).toThrow("Supported languages must include 'en'");

    const selector = AppLanguageSelector.createWithStorage(baseOptions);
    expect(() => selector.setLanguage('sv')).toThrow(
      "Failed to change language to 'sv', available languages are 'en', 'de'",
    );
  });
});
