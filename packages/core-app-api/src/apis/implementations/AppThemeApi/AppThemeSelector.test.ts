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

interface UserSettingsSignal {
  type: 'key-changed';
  key: string;
  value?: any;
}
const mockErrorApi = { post: jest.fn(), error$: jest.fn() };

describe('AppThemeSelector', () => {
  it('should should select new themes', async () => {
    const selector = AppThemeSelector.create([]);

    expect(selector.getInstalledThemes()).toEqual([]);

    const subFn = jest.fn();
    selector.activeThemeId$().subscribe(subFn);
    expect(selector.getActiveThemeId()).toBe(undefined);
    await 'wait a tick';
    expect(subFn).toHaveBeenLastCalledWith(undefined);

    // Set up storage before calling setActiveThemeId
    const mockStorageApi = {
      forBucket: jest.fn().mockReturnValue({
        set: jest.fn().mockResolvedValue(undefined),
        observe$: jest.fn().mockReturnValue({
          subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
        }),
      }),
    } as any;
    selector.setStorage(mockStorageApi, mockErrorApi, undefined);

    selector.setActiveThemeId('x');
    expect(subFn).toHaveBeenLastCalledWith('x');
    expect(selector.getActiveThemeId()).toBe('x');

    selector.setActiveThemeId(undefined);
    expect(subFn).toHaveBeenLastCalledWith(undefined);
    expect(selector.getActiveThemeId()).toBe('null');
  });

  it('should return a new array of themes', () => {
    const themes = new Array<AppTheme>();
    const selector = AppThemeSelector.create(themes);

    expect(selector.getInstalledThemes()).toEqual(themes);
    expect(selector.getInstalledThemes()).not.toBe(themes);
  });

  describe('setStorage', () => {
    let mockStorageApi: jest.Mocked<any>;
    let mockSignalApi: jest.Mocked<any>;

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

      mockSignalApi = {
        subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
      } as any;
    });

    it('should set up storage and signal API', () => {
      const selector = AppThemeSelector.create([]);

      selector.setStorage(mockStorageApi, mockErrorApi, mockSignalApi);

      expect(mockStorageApi.forBucket).toHaveBeenCalledWith('userSettings');
      expect(mockSignalApi.subscribe).toHaveBeenCalledWith(
        'user-settings',
        expect.any(Function),
      );
    });

    it('should clean up existing subscriptions when setting storage again', () => {
      const selector = AppThemeSelector.create([]);

      // Set storage first time
      selector.setStorage(mockStorageApi, mockErrorApi, mockSignalApi);
      const firstSubscription = mockSignalApi.subscribe.mock.results[0].value;

      // Set storage second time
      selector.setStorage(mockStorageApi, mockErrorApi, mockSignalApi);

      // Should have unsubscribed from first subscription
      expect(firstSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('should handle cross-device synchronization via signals', async () => {
      const selector = AppThemeSelector.create([
        { id: 'light', title: 'Light', variant: 'light', Provider: () => null },
        { id: 'dark', title: 'Dark', variant: 'dark', Provider: () => null },
      ]);

      selector.setStorage(mockStorageApi, mockErrorApi, mockSignalApi);

      // Get the signal handler
      const signalHandler = mockSignalApi.subscribe.mock.calls[0][1];

      // Mock storage to return a different theme
      const mockSubscription = { unsubscribe: jest.fn() };
      const mockObserve$ = jest.fn().mockReturnValue({
        subscribe: jest.fn().mockImplementation(callback => {
          // Simulate storage returning 'dark' theme
          callback({ value: 'dark' });
          return mockSubscription;
        }),
      });
      (mockStorageApi.forBucket('userSettings') as any).observe$ = mockObserve$;

      // Simulate signal from another device
      const signal: UserSettingsSignal = {
        key: 'theme',
        type: 'key-changed',
      };

      signalHandler(signal);

      // Should update to dark theme
      expect(selector.getActiveThemeId()).toBe('dark');
    });

    it('should not update theme if signal is for different key', () => {
      const selector = AppThemeSelector.create([
        { id: 'light', title: 'Light', variant: 'light', Provider: () => null },
      ]);

      selector.setStorage(mockStorageApi, mockErrorApi, mockSignalApi);
      selector.setActiveThemeId('light');

      const signalHandler = mockSignalApi.subscribe.mock.calls[0][1];

      // Simulate signal for different key
      const signal: UserSettingsSignal = {
        key: 'language',
        type: 'key-changed',
      };

      signalHandler(signal);

      // Should not change theme
      expect(selector.getActiveThemeId()).toBe('light');
    });

    it('should handle initial load without overwriting storage', () => {
      const selector = AppThemeSelector.create([
        { id: 'light', title: 'Light', variant: 'light', Provider: () => null },
      ]);

      selector.setStorage(mockStorageApi, mockErrorApi, mockSignalApi);

      // Should not call set on storage during initial load
      expect(
        (mockStorageApi.forBucket('userSettings') as any).set,
      ).not.toHaveBeenCalled();
    });

    it('should persist changes after initial load', async () => {
      const selector = AppThemeSelector.create([
        { id: 'light', title: 'Light', variant: 'light', Provider: () => null },
      ]);

      selector.setStorage(mockStorageApi, mockErrorApi, mockSignalApi);

      // Change theme after initial load
      selector.setActiveThemeId('light');
      await 'wait a tick';

      expect(
        (mockStorageApi.forBucket('userSettings') as any).set,
      ).toHaveBeenCalledWith('theme', 'light');
    });
  });

  describe('destroy', () => {
    it('should clean up all subscriptions', () => {
      const selector = AppThemeSelector.create([]);
      const mockStorageApi = {
        forBucket: jest.fn().mockReturnValue({
          observe$: jest.fn().mockReturnValue({
            subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
          }),
        }),
      } as any;

      selector.setStorage(mockStorageApi, mockErrorApi);

      expect(() => selector.destroy()).not.toThrow();
    });
  });
});
