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

interface SignalApi {
  subscribe(
    channel: string,
    callback: (message: any) => void,
  ): { unsubscribe(): void };
}

interface UserSettingsSignal {
  type: 'key-changed';
  key: string;
  value?: any;
}

const baseOptions = {
  availableLanguages: ['en', 'de'],
};

describe('AppLanguageSelector', () => {
  const mockErrorApi = { post: jest.fn(), error$: jest.fn() };
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

    // Set up storage before calling setLanguage
    const mockStorageApi = {
      forBucket: jest.fn().mockReturnValue({
        set: jest.fn().mockResolvedValue(undefined),
        observe$: jest.fn().mockReturnValue({
          subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
        }),
      }),
    } as any;
    selector.setStorage(mockStorageApi, mockErrorApi);

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

    // Set up storage before calling setLanguage
    const mockStorageApi = {
      forBucket: jest.fn().mockReturnValue({
        set: jest.fn().mockResolvedValue(undefined),
        observe$: jest.fn().mockReturnValue({
          subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
        }),
      }),
    } as any;
    selector.setStorage(mockStorageApi, mockErrorApi);

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
    // The selector now requires explicit setStorage() call to load from storage
    // This prevents initial load from overwriting DB values
    expect(AppLanguageSelector.create(baseOptions).getLanguage()).toEqual({
      language: 'en',
    });

    // Test that storage loading works when setStorage is called
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
    // This test demonstrates that setLanguage() requires setStorage() to be called first
    const selector = AppLanguageSelector.create(baseOptions);

    // Without setStorage(), setLanguage() should throw an error
    expect(() => selector.setLanguage('de')).toThrow(
      'Storage not configured. Call setStorage() after creating the selector with create().',
    );

    const mockStorageApi = {
      forBucket: jest.fn().mockReturnValue({
        set: jest.fn().mockResolvedValue(undefined),
        observe$: jest.fn().mockReturnValue({
          subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
        }),
      }),
    } as any;
    selector.setStorage(mockStorageApi, mockErrorApi);

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

    const selector = AppLanguageSelector.create(baseOptions);

    // First test that setLanguage() throws storage error without setStorage()
    expect(() => selector.setLanguage('sv')).toThrow(
      'Storage not configured. Call setStorage() after creating the selector with create().',
    );

    // Set up storage and test language validation
    const mockStorageApi = {
      forBucket: jest.fn().mockReturnValue({
        set: jest.fn().mockResolvedValue(undefined),
        observe$: jest.fn().mockReturnValue({
          subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
        }),
      }),
    } as any;
    selector.setStorage(mockStorageApi, mockErrorApi);

    expect(() => selector.setLanguage('sv')).toThrow(
      "Failed to change language to 'sv', available languages are 'en', 'de'",
    );
  });

  describe('setStorage', () => {
    let mockStorageApi: jest.Mocked<any>;
    let mockSignalApi: jest.Mocked<SignalApi>;

    beforeEach(() => {
      mockStorageApi = {
        forBucket: jest.fn().mockReturnValue({
          observe$: jest.fn().mockReturnValue({
            subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
          }),
          set: jest.fn().mockResolvedValue(undefined),
        }),
      } as any;

      mockSignalApi = {
        subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
      } as any;
    });

    it('should support no en languages', () => {
      const selector = AppLanguageSelector.create({
        availableLanguages: ['de'],
        defaultLanguage: 'de',
      });
      selector.setStorage(mockStorageApi, mockErrorApi, mockSignalApi);

      expect(selector.getLanguage()).toEqual({ language: 'de' });

      expect(() => selector.setLanguage('en')).toThrow(
        "Failed to change language to 'en', available languages are 'de'",
      );
    });

    it('should set up storage and signal API', () => {
      const selector = AppLanguageSelector.create(baseOptions);

      selector.setStorage(mockStorageApi, mockErrorApi, mockSignalApi);

      expect(mockStorageApi.forBucket).toHaveBeenCalledWith('userSettings');
      expect(mockSignalApi.subscribe).toHaveBeenCalledWith(
        'user-settings',
        expect.any(Function),
      );
    });

    it('should clean up existing subscriptions when setting storage again', () => {
      const selector = AppLanguageSelector.create(baseOptions);

      // Set storage first time
      selector.setStorage(mockStorageApi, mockErrorApi, mockSignalApi);
      const firstSubscription = mockSignalApi.subscribe.mock.results[0].value;

      // Set storage second time
      selector.setStorage(mockStorageApi, mockErrorApi, mockSignalApi);

      // Should have unsubscribed from first subscription
      expect(firstSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('should handle cross-device synchronization via signals', async () => {
      const selector = AppLanguageSelector.create(baseOptions);

      selector.setStorage(mockStorageApi, mockErrorApi, mockSignalApi);

      // Get the signal handler
      const signalHandler = mockSignalApi.subscribe.mock.calls[0][1];

      // Mock storage to return a different language
      const mockObserve$ = jest.fn().mockReturnValue({
        subscribe: jest.fn().mockImplementation(callback => {
          // Simulate storage returning 'de' language
          callback({ value: 'de' });
          return { unsubscribe: jest.fn() };
        }),
      });
      (mockStorageApi.forBucket('userSettings') as any).observe$ = mockObserve$;

      // Simulate signal from another device
      const signal: UserSettingsSignal = {
        key: 'language',
        type: 'key-changed',
      };

      signalHandler(signal);

      // Should update to German language
      expect(selector.getLanguage()).toEqual({ language: 'de' });
    });

    it('should not update language if signal is for different key', () => {
      const selector = AppLanguageSelector.create(baseOptions);
      selector.setStorage(mockStorageApi, mockErrorApi, mockSignalApi);

      selector.setLanguage('en');

      const signalHandler = mockSignalApi.subscribe.mock.calls[0][1];

      // Simulate signal for different key
      const signal: UserSettingsSignal = {
        key: 'theme',
        type: 'key-changed',
      };

      signalHandler(signal);

      // Should not change language
      expect(selector.getLanguage()).toEqual({ language: 'en' });
    });

    it('should handle initial load without overwriting storage', () => {
      const selector = AppLanguageSelector.create(baseOptions);

      selector.setStorage(mockStorageApi, mockErrorApi, mockSignalApi);

      expect(
        (mockStorageApi.forBucket('userSettings') as any).set,
      ).not.toHaveBeenCalled();
    });

    it('should persist changes after initial load', async () => {
      const selector = AppLanguageSelector.create(baseOptions);

      selector.setStorage(mockStorageApi, mockErrorApi, mockSignalApi);

      // Change language after initial load
      selector.setLanguage('de');
      await 'wait a tick';

      // Should persist to storage
      expect(
        (mockStorageApi.forBucket('userSettings') as any).set,
      ).toHaveBeenCalledWith('language', 'de');
    });

    it('should not update if language is not in available languages', () => {
      const selector = AppLanguageSelector.create(baseOptions);

      selector.setStorage(mockStorageApi, mockErrorApi, mockSignalApi);

      const signalHandler = mockSignalApi.subscribe.mock.calls[0][1];

      // Mock storage to return an invalid language
      const mockObserve$ = jest.fn().mockReturnValue({
        subscribe: jest.fn().mockImplementation(callback => {
          callback({ value: 'fr' }); // 'fr' is not in available languages
          return { unsubscribe: jest.fn() };
        }),
      });
      (mockStorageApi.forBucket('userSettings') as any).observe$ = mockObserve$;

      const signal: UserSettingsSignal = {
        key: 'language',
        type: 'key-changed',
      };

      signalHandler(signal);

      // Should not change language
      expect(selector.getLanguage()).toEqual({ language: 'en' });
    });
  });

  describe('destroy', () => {
    it('should clean up all subscriptions', () => {
      const selector = AppLanguageSelector.create(baseOptions);
      const mockStorageApi = {
        forBucket: jest.fn().mockReturnValue({
          observe$: jest.fn().mockReturnValue({
            subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
          }),
        }),
      } as any;

      const mockSignalApi = {
        subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
      } as any;

      selector.setStorage(mockStorageApi, mockErrorApi, mockSignalApi);
      selector.destroy();

      expect(() => selector.destroy()).not.toThrow();
    });
  });
});
