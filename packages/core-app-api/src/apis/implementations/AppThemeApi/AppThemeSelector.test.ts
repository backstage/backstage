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
    selector.setStorage(mockStorageApi, mockErrorApi);

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

    it('should set up storage', () => {
      const selector = AppThemeSelector.create([]);

      selector.setStorage(mockStorageApi, mockErrorApi);

      expect(mockStorageApi.forBucket).toHaveBeenCalledWith('userSettings');
    });

    it('should handle initial load without overwriting storage', () => {
      const selector = AppThemeSelector.create([
        { id: 'light', title: 'Light', variant: 'light', Provider: () => null },
      ]);

      selector.setStorage(mockStorageApi, mockErrorApi);

      // Should not call set on storage during initial load
      expect(
        (mockStorageApi.forBucket('userSettings') as any).set,
      ).not.toHaveBeenCalled();
    });

    it('should persist changes after initial load', async () => {
      const selector = AppThemeSelector.create([
        { id: 'light', title: 'Light', variant: 'light', Provider: () => null },
      ]);

      selector.setStorage(mockStorageApi, mockErrorApi);

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
