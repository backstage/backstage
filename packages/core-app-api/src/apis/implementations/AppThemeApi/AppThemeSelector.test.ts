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

import { AppTheme } from '@backstage/core-plugin-api';
import { AppThemeSelector } from './AppThemeSelector';

const mockErrorApi = { post: jest.fn(), error$: jest.fn() };

describe('AppThemeSelector', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should should select new themes', async () => {
    const observeObservers: any[] = [];
    const mockObserve$ = jest.fn().mockReturnValue({
      subscribe: jest.fn().mockImplementation(observer => {
        observeObservers.push(observer);
        return { unsubscribe: jest.fn() };
      }),
    });

    const mockBucket = {
      snapshot: jest.fn().mockReturnValue({ presence: 'unknown' }),
      observe$: mockObserve$,
      set: jest.fn().mockImplementation(async (_key, value) => {
        observeObservers.forEach(observer => {
          if (observer && observer.next) {
            observer.next({ value });
          }
        });
      }),
    };

    // Ensure forBucket always returns the same bucket instance
    const mockStorageApi = {
      forBucket: jest.fn().mockReturnValue(mockBucket),
    } as any;

    const selector = AppThemeSelector.createWithStorage({
      themes: [
        {
          id: 'x',
          title: 'Test Theme',
          variant: 'light',
          Provider: () => null,
        },
      ],
      storageApi: mockStorageApi,
      errorApi: mockErrorApi,
    });

    expect(selector.getInstalledThemes()).toHaveLength(1);
    expect(selector.getInstalledThemes()[0].id).toBe('x');

    const subFn = jest.fn();
    const subscription = selector.activeThemeId$().subscribe(subFn);
    expect(selector.getActiveThemeId()).toBe(undefined);
    await 'wait a tick';
    expect(subFn).not.toHaveBeenCalled();

    expect(mockObserve$).toHaveBeenCalled();
    expect(observeObservers.length).toBeGreaterThan(0);

    // Verify set is being called
    selector.setActiveThemeId('x');
    expect(mockBucket.set).toHaveBeenCalledWith('theme', 'x');
    await 'wait a tick';
    expect(subFn).toHaveBeenLastCalledWith('x');
    expect(selector.getActiveThemeId()).toBe('x');

    subscription.unsubscribe();

    // Create a new subscription for the next test
    const subFn2 = jest.fn();
    selector.activeThemeId$().subscribe(subFn2);
    await 'wait a tick';

    selector.setActiveThemeId(undefined);
    expect(mockBucket.set).toHaveBeenCalledWith('theme', null);
    await 'wait a tick';
    expect(subFn2).toHaveBeenLastCalledWith(undefined);
    expect(selector.getActiveThemeId()).toBe(undefined);
  });

  it('should return a new array of themes', () => {
    const themes = new Array<AppTheme>();
    const selector = AppThemeSelector.create(themes);

    expect(selector.getInstalledThemes()).toEqual(themes);
    expect(selector.getInstalledThemes()).not.toBe(themes);
  });

  describe('createWithStorage', () => {
    let mockStorageApi: jest.Mocked<any>;

    beforeEach(() => {
      mockStorageApi = {
        forBucket: jest.fn().mockReturnValue({
          snapshot: jest.fn().mockReturnValue({ presence: 'unknown' }),
          observe$: jest.fn().mockReturnValue({
            subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
          }),
          set: jest.fn().mockResolvedValue(undefined),
        }),
      } as any;
    });

    it('should set up storage', async () => {
      const selector = AppThemeSelector.createWithStorage({
        themes: [],
        storageApi: mockStorageApi,
        errorApi: mockErrorApi,
      });

      expect(mockStorageApi.forBucket).toHaveBeenCalledWith('userSettings');
      expect(selector).toBeDefined();
    });

    it('should handle initial load without overwriting storage', async () => {
      const selector = AppThemeSelector.createWithStorage({
        themes: [
          {
            id: 'light',
            title: 'Light',
            variant: 'light',
            Provider: () => null,
          },
        ],
        storageApi: mockStorageApi,
        errorApi: mockErrorApi,
      });

      // Should not call set on storage during initial load
      expect(
        (mockStorageApi.forBucket('userSettings') as any).set,
      ).not.toHaveBeenCalled();
      expect(selector).toBeDefined();
    });

    it('should persist changes after initial load', async () => {
      const selector = AppThemeSelector.createWithStorage({
        themes: [
          {
            id: 'light',
            title: 'Light',
            variant: 'light',
            Provider: () => null,
          },
        ],
        storageApi: mockStorageApi,
        errorApi: mockErrorApi,
      });

      // Change theme after initial load
      selector.setActiveThemeId('light');
      await 'wait a tick';

      expect(
        (mockStorageApi.forBucket('userSettings') as any).set,
      ).toHaveBeenCalledWith('theme', 'light');
    });

    it('should handle sync storage (WebStorage)', () => {
      const mockSyncStorage = {
        forBucket: jest.fn().mockReturnValue({
          snapshot: jest.fn().mockReturnValue({
            presence: 'present',
            value: 'dark',
          }),
          observe$: jest.fn().mockReturnValue({
            subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
          }),
          set: jest.fn().mockResolvedValue(undefined),
        }),
      } as any;

      const selector = AppThemeSelector.createWithStorage({
        themes: [
          {
            id: 'dark',
            title: 'Dark',
            variant: 'dark',
            Provider: () => null,
          },
        ],
        storageApi: mockSyncStorage,
        errorApi: mockErrorApi,
      });

      // Should read from snapshot immediately
      expect(selector.getActiveThemeId()).toBe('dark');
    });
  });

  describe('destroy', () => {
    it('should clean up all subscriptions', async () => {
      const mockStorageApi = {
        forBucket: jest.fn().mockReturnValue({
          snapshot: jest.fn().mockReturnValue({ presence: 'unknown' }),
          observe$: jest.fn().mockReturnValue({
            subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
          }),
        }),
      } as any;

      const selector = AppThemeSelector.createWithStorage({
        themes: [],
        storageApi: mockStorageApi,
        errorApi: mockErrorApi,
      });

      expect(() => selector.destroy()).not.toThrow();
    });
  });
});
