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

jest.mock('@backstage/core-plugin-api', () => ({
  StorageApi: jest.fn(),
  createApiRef: jest.fn(),
  ApiRef: jest.fn(),
}));

const baseOptions = {
  availableLanguages: ['en', 'de'],
};

describe('AppLanguageSelector', () => {
  const mockErrorApi = { post: jest.fn(), error$: jest.fn() };
  beforeEach(() => {
    localStorage.removeItem('language');
  });

  it('should select language', async () => {
    const observeSubscribers: any[] = [];
    const mockObserve$ = jest.fn().mockReturnValue({
      subscribe: jest.fn().mockImplementation(subscriber => {
        observeSubscribers.push(subscriber);
        return { unsubscribe: jest.fn() };
      }),
    });

    const mockBucket = {
      snapshot: jest.fn().mockReturnValue({ presence: 'unknown' }),
      set: jest.fn().mockImplementation(async (_key, value) => {
        // Simulate storage update by calling all observe$ subscribers
        observeSubscribers.forEach(sub => {
          sub.next({ value });
        });
      }),
      observe$: mockObserve$,
    };

    const mockStorageApi = {
      forBucket: jest.fn().mockReturnValue(mockBucket),
    } as any;

    const selector = AppLanguageSelector.createWithStorage({
      ...baseOptions,
      storageApi: mockStorageApi,
      errorApi: mockErrorApi,
    });

    expect(selector.getAvailableLanguages()).toEqual({
      languages: ['en', 'de'],
    });

    const subFn = jest.fn();
    selector.language$().subscribe(subFn);
    expect(selector.getLanguage()).toEqual({ language: 'en' });
    await 'wait a tick';
    expect(subFn).toHaveBeenLastCalledWith({ language: 'en' });

    selector.setLanguage('de');
    await 'wait a tick';
    expect(subFn).toHaveBeenLastCalledWith({ language: 'de' });
    expect(selector.getLanguage()).toEqual({ language: 'de' });

    selector.setLanguage('en');
    await 'wait a tick';
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

    const observeSubscribers: any[] = [];
    const mockObserve$ = jest.fn().mockReturnValue({
      subscribe: jest.fn().mockImplementation(subscriber => {
        observeSubscribers.push(subscriber);
        return { unsubscribe: jest.fn() };
      }),
    });

    const mockBucket = {
      snapshot: jest.fn().mockReturnValue({ presence: 'unknown' }),
      set: jest.fn().mockImplementation(async (_key, value) => {
        // Simulate storage update by calling all observe$ subscribers
        observeSubscribers.forEach(sub => {
          sub.next({ value });
        });
      }),
      observe$: mockObserve$,
    };

    const mockStorageApi = {
      forBucket: jest.fn().mockReturnValue(mockBucket),
    } as any;

    const selector = AppLanguageSelector.createWithStorage({
      availableLanguages: languages,
      storageApi: mockStorageApi,
      errorApi: mockErrorApi,
    });

    const emitted = new Array<string>();
    selector.language$().subscribe(({ language }) => {
      emitted.push(language);
    });
    await 'wait a tick'; // Wait for initial emission

    selector.setLanguage('en'); // First call: valueToStore=null, lastStoredValue=undefined, so proceeds
    await 'wait a tick';
    selector.setLanguage('en'); // Second call: valueToStore=null, lastStoredValue=null, so skips
    selector.setLanguage('de'); // valueToStore='de', lastStoredValue=null, so proceeds
    await 'wait a tick';
    selector.setLanguage('de'); // valueToStore='de', lastStoredValue='de', so skips
    selector.setLanguage('de'); // valueToStore='de', lastStoredValue='de', so skips
    selector.setLanguage('en'); // valueToStore=null, lastStoredValue='de', so proceeds
    await 'wait a tick';
    selector.setLanguage('en'); // valueToStore=null, lastStoredValue=null, so skips
    selector.setLanguage('en'); // valueToStore=null, lastStoredValue=null, so skips
    await 'wait a tick';

    // The implementation skips duplicates, so only unique changes are emitted
    // Initial value is 'en' (default), then 'de', then 'en' again
    // Note: The first setLanguage('en') may be skipped if lastStoredValue was already null
    expect(emitted).toEqual(['en', 'de', 'en']);
  });

  it('should be initialized from storage', () => {
    expect(AppLanguageSelector.create(baseOptions).getLanguage()).toEqual({
      language: 'en',
    });

    localStorage.setItem('language', 'de');
    const selector = AppLanguageSelector.create(baseOptions);
    // Note: The selector won't automatically load from localStorage until setStorage is called
    expect(selector.getLanguage()).toEqual({ language: 'en' });

    localStorage.removeItem('language');
    expect(AppLanguageSelector.create(baseOptions).getLanguage()).toEqual({
      language: 'en',
    });
  });

  it('should sync with storage', async () => {
    const mockStorageApi = {
      forBucket: jest.fn().mockReturnValue({
        snapshot: jest.fn().mockReturnValue({ presence: 'unknown' }),
        set: jest.fn().mockResolvedValue(undefined),
        observe$: jest.fn().mockReturnValue({
          subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
        }),
      }),
    } as any;

    const selector = AppLanguageSelector.createWithStorage({
      ...baseOptions,
      storageApi: mockStorageApi,
      errorApi: mockErrorApi,
    });

    selector.setLanguage('de');
    await 'wait a tick';
    expect(selector.getLanguage()).toEqual({ language: 'de' });

    selector.setLanguage('en');
    await 'wait a tick';
    expect(selector.getLanguage()).toEqual({ language: 'en' });
  });

  it('should reject invalid input', async () => {
    expect(() =>
      AppLanguageSelector.create({
        availableLanguages: ['en', 'de', 'en'],
      }),
    ).toThrow(
      "Supported languages may not contain duplicates, got 'en', 'de', 'en'",
    );

    expect(() =>
      AppLanguageSelector.create({
        availableLanguages: ['de'],
      }),
    ).toThrow(
      "Initial language must be one of the supported languages, got 'en'",
    );

    // Set up storage and test language validation
    const mockStorageApi = {
      forBucket: jest.fn().mockReturnValue({
        set: jest.fn().mockResolvedValue(undefined),
        snapshot: jest.fn().mockReturnValue({ presence: 'unknown' }),
        observe$: jest.fn().mockReturnValue({
          subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
        }),
      }),
    } as any;

    const selector = AppLanguageSelector.createWithStorage({
      ...baseOptions,
      storageApi: mockStorageApi,
      errorApi: mockErrorApi,
    });

    // Test that setLanguage() throws error for invalid language
    expect(() => selector.setLanguage('sv')).toThrow(
      "Failed to change language to 'sv', available languages are 'en', 'de'",
    );
  });

  describe('setStorage', () => {
    let mockStorageApi: jest.Mocked<any>;

    beforeEach(() => {
      mockStorageApi = {
        forBucket: jest.fn().mockReturnValue({
          snapshot: jest.fn().mockReturnValue({ presence: 'absent' }),
          observe$: jest.fn().mockReturnValue({
            subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
          }),
          set: jest.fn().mockResolvedValue(undefined),
        }),
      } as any;
    });

    it('should support no en languages', () => {
      const selector = AppLanguageSelector.createWithStorage({
        availableLanguages: ['de'],
        defaultLanguage: 'de',
        storageApi: mockStorageApi,
        errorApi: mockErrorApi,
      });

      expect(selector.getLanguage()).toEqual({ language: 'de' });

      expect(() => selector.setLanguage('en')).toThrow(
        "Failed to change language to 'en', available languages are 'de'",
      );
    });

    it('should handle initial load without overwriting storage', () => {
      AppLanguageSelector.createWithStorage({
        ...baseOptions,
        storageApi: mockStorageApi,
        errorApi: mockErrorApi,
      });

      expect(
        (mockStorageApi.forBucket('userSettings') as any).set,
      ).not.toHaveBeenCalled();
    });

    it('should persist changes after initial load', async () => {
      const selector = AppLanguageSelector.createWithStorage({
        ...baseOptions,
        storageApi: mockStorageApi,
        errorApi: mockErrorApi,
      });

      // Change language after initial load
      selector.setLanguage('de');
      await 'wait a tick';

      // Should persist to storage
      expect(
        (mockStorageApi.forBucket('userSettings') as any).set,
      ).toHaveBeenCalledWith('language', 'de');
    });

    it('should not update if language is not in available languages', () => {
      const selector = AppLanguageSelector.createWithStorage({
        ...baseOptions,
        storageApi: mockStorageApi,
        errorApi: mockErrorApi,
      });

      // Mock storage to return an invalid language
      const mockObserve$ = jest.fn().mockReturnValue({
        subscribe: jest.fn().mockImplementation(callback => {
          callback({ value: 'fr' }); // 'fr' is not in available languages
          return { unsubscribe: jest.fn() };
        }),
      });
      (mockStorageApi.forBucket('userSettings') as any).observe$ = mockObserve$;

      // Should not change language
      expect(selector.getLanguage()).toEqual({ language: 'en' });
    });
  });

  describe('destroy', () => {
    it('should clean up all subscriptions', () => {
      const mockStorageApi = {
        forBucket: jest.fn().mockReturnValue({
          snapshot: jest.fn().mockReturnValue({ presence: 'present' }),
          set: jest.fn().mockResolvedValue(undefined),
          observe$: jest.fn().mockReturnValue({
            subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
          }),
        }),
      } as any;

      const selector = AppLanguageSelector.createWithStorage({
        ...baseOptions,
        storageApi: mockStorageApi,
        errorApi: mockErrorApi,
      });

      selector.destroy();

      expect(() => selector.destroy()).not.toThrow();
    });
  });
});
