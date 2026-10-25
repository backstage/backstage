/*
 * Copyright 2025 The Backstage Authors
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
  coreApis,
  createRouteRef,
  FeatureFlagState,
  type PendingOAuthRequest,
} from '@backstage/frontend-plugin-api';
import { createElement } from 'react';
import { mockApis } from './mockApis';
import { getMockApiFactory } from './MockWithApiFactory';

describe('mockApis', () => {
  describe('alert', () => {
    it('can create an instance', () => {
      const alert = mockApis.alert();
      alert.post({ message: 'test alert' });
      expect(alert.getAlerts()).toHaveLength(1);
      expect(alert.getAlerts()[0]).toMatchObject({ message: 'test alert' });
    });

    it('can clear alerts', () => {
      const alert = mockApis.alert();
      alert.post({ message: 'test' });
      expect(alert.getAlerts()).toHaveLength(1);
      alert.clearAlerts();
      expect(alert.getAlerts()).toHaveLength(0);
    });

    it('can create a mock and make assertions on it', () => {
      const alert = mockApis.alert.mock({
        post: jest.fn(msg => {
          expect(msg).toMatchObject({ message: 'test' });
        }),
      });
      alert.post({ message: 'test' });
      expect(alert.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('featureFlags', () => {
    it('can create an instance', () => {
      const featureFlags = mockApis.featureFlags({
        initialStates: { 'test-flag': FeatureFlagState.Active },
      });
      expect(featureFlags.isActive('test-flag')).toBe(true);
      expect(featureFlags.isActive('other-flag')).toBe(false);
    });

    it('can save and merge state', () => {
      const featureFlags = mockApis.featureFlags({
        initialStates: { 'flag-1': FeatureFlagState.Active },
      });

      featureFlags.save({
        states: { 'flag-2': FeatureFlagState.Active },
        merge: true,
      });

      expect(featureFlags.isActive('flag-1')).toBe(true);
      expect(featureFlags.isActive('flag-2')).toBe(true);
    });

    it('can set and clear state using helper methods', () => {
      const featureFlags = mockApis.featureFlags();
      featureFlags.setState({ 'test-flag': FeatureFlagState.Active });
      expect(featureFlags.getState()).toEqual({
        'test-flag': FeatureFlagState.Active,
      });
      featureFlags.clearState();
      expect(featureFlags.getState()).toEqual({});
    });

    it('can create a mock and make assertions on it', () => {
      const featureFlags = mockApis.featureFlags.mock({
        isActive: jest.fn(() => true),
      });
      expect(featureFlags.isActive('test')).toBe(true);
      expect(featureFlags.isActive).toHaveBeenCalledTimes(1);
    });
  });

  it('provides a registered jest mock for every core API', () => {
    for (const name of Object.keys(coreApis) as (keyof typeof coreApis)[]) {
      const mock = mockApis[name].mock();
      const factory = getMockApiFactory(mock)!;
      expect(factory.api).toBe(coreApis[name]);
      expect(factory.deps).toEqual({});
      expect(factory.factory({})).toBe(mock);
      for (const method of Object.values(mock)) {
        expect(jest.isMockFunction(method)).toBe(true);
        expect((method as jest.Mock).getMockImplementation()).toBeUndefined();
      }
    }
    expect(getMockApiFactory(mockApis.permission.mock())?.api.id).toBe(
      'plugin.permission.api',
    );
  });

  it('keeps language and theme selections in memory and notifies subscribers', async () => {
    const language = mockApis.appLanguage({ availableLanguages: ['en', 'sv'] });
    const languageListener = jest.fn();
    const subscription = language.language$().subscribe(languageListener);
    await Promise.resolve();
    expect(language.getAvailableLanguages()).toEqual({
      languages: ['en', 'sv'],
    });
    expect(languageListener).toHaveBeenLastCalledWith({ language: 'en' });
    language.setLanguage('sv');
    expect(language.getLanguage()).toEqual({ language: 'sv' });
    expect(languageListener).toHaveBeenLastCalledWith({ language: 'sv' });
    language.setLanguage();
    expect(language.getLanguage()).toEqual({ language: 'en' });
    expect(() => language.setLanguage('unknown')).toThrow('not available');
    subscription.unsubscribe();
    languageListener.mockClear();
    language.setLanguage('sv');
    expect(languageListener).not.toHaveBeenCalled();
    expect(mockApis.appLanguage().getLanguage()).toEqual({ language: 'en' });

    const theme = mockApis.appTheme();
    const themeListener = jest.fn();
    const themeSubscription = theme.activeThemeId$().subscribe(themeListener);
    await Promise.resolve();
    expect(theme.getInstalledThemes()).toEqual([]);
    expect(themeListener).toHaveBeenLastCalledWith(undefined);
    theme.setActiveThemeId('dark');
    expect(theme.getActiveThemeId()).toBe('dark');
    expect(themeListener).toHaveBeenLastCalledWith('dark');
    theme.setActiveThemeId();
    expect(theme.getActiveThemeId()).toBeUndefined();
    themeSubscription.unsubscribe();
    themeListener.mockClear();
    theme.setActiveThemeId('light');
    expect(themeListener).not.toHaveBeenCalled();
    expect(getMockApiFactory(language)?.api).toBe(coreApis.appLanguage);
    expect(getMockApiFactory(theme)?.api).toBe(coreApis.appTheme);
  });

  it('supports lifecycle changes and plugin-scoped lookups', () => {
    const lifecycle = mockApis.appLifecycle({ finalized: false });
    const listener = jest.fn();
    const unsubscribe = lifecycle.subscribe(listener);
    expect(lifecycle.isFinalized()).toBe(false);
    lifecycle.setFinalized(true);
    lifecycle.setFinalized(true);
    expect(lifecycle.isFinalized()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    lifecycle.setFinalized(false);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(mockApis.appLifecycle().isFinalized()).toBe(true);

    const element = createElement('span', null, 'Custom');
    const icons = mockApis.icons({ icons: { custom: element } });
    expect(icons.icon('custom')).toBe(element);
    expect(icons.listIconKeys()).toEqual(['custom']);
    expect(icons.getIcon('custom')).toEqual(expect.any(Function));
    expect(icons.icon('missing')).toBeUndefined();
    expect(icons.getIcon('missing')).toBeUndefined();
    expect(mockApis.icons().listIconKeys()).toEqual([]);

    const actions = mockApis.pluginHeaderActions({
      actions: { test: [element] },
    });
    expect(actions.getPluginHeaderActions('test')).toEqual([element]);
    expect(actions.getPluginHeaderActions('other')).toEqual([]);
    expect(
      mockApis.pluginHeaderActions().getPluginHeaderActions('test'),
    ).toEqual([]);
    for (const [api, ref] of [
      [lifecycle, coreApis.appLifecycle],
      [icons, coreApis.icons],
      [actions, coreApis.pluginHeaderActions],
    ]) {
      expect(getMockApiFactory(api)?.api).toBe(ref);
    }
  });

  it('collects toasts and closes each posted notification independently', () => {
    const toast = mockApis.toast();
    const message = { title: 'Test' };
    const first = toast.post(message);
    const second = toast.post(message);
    expect(toast.getToasts()).toEqual([message, message]);
    first.close();
    first.close();
    expect(toast.getToasts()).toEqual([message]);
    second.close();
    expect(toast.getToasts()).toEqual([]);
    expect(mockApis.toast().getToasts()).toEqual([]);
    expect(getMockApiFactory(toast)?.api).toBe(coreApis.toast);
  });

  it('coordinates typed OAuth requests until triggered or rejected', async () => {
    const oauth = mockApis.oauthRequest();
    let pending: PendingOAuthRequest[] = [];
    const subscription = oauth.authRequest$().subscribe(value => {
      pending = value;
    });
    await Promise.resolve();
    const onAuthRequest = jest.fn(async (scopes: Set<string>) => ({
      scopes: [...scopes].sort(),
    }));
    const request = oauth.createAuthRequester({
      provider: { id: 'test', title: 'Test', icon: () => null },
      onAuthRequest,
    });
    await Promise.resolve();
    const first = request(new Set(['read']));
    const second = request(new Set(['write']));
    expect(onAuthRequest).not.toHaveBeenCalled();
    expect(pending).toHaveLength(1);
    await pending[0].trigger();
    await expect(first).resolves.toEqual({ scopes: ['read', 'write'] });
    await expect(second).resolves.toEqual({ scopes: ['read', 'write'] });
    expect(onAuthRequest).toHaveBeenCalledTimes(1);
    expect(pending).toEqual([]);
    const rejected = request(new Set(['read']));
    pending[0].reject();
    await expect(rejected).rejects.toThrow();
    subscription.unsubscribe();
    expect(getMockApiFactory(oauth)?.api).toBe(coreApis.oauthRequest);
  });

  it('supports typed overrides including generic methods', async () => {
    const oauth = mockApis.oauthRequest.mock({
      createAuthRequester: ({ onAuthRequest }) => onAuthRequest,
    });
    const requester = oauth.createAuthRequester({
      provider: { id: 'test', title: 'Test', icon: () => null },
      onAuthRequest: async scopes => ({ token: [...scopes].join(' ') }),
    });
    const response: { token: string } = await requester(new Set(['read']));
    expect(response).toEqual({ token: 'read' });
    expect(oauth.createAuthRequester).toHaveBeenCalledTimes(1);

    const routeRef = createRouteRef({ params: ['name'] });
    const routing = mockApis.routeResolution.mock({
      resolve:
        () =>
        (...[params]) =>
          `/test/${(params as { name: string }).name}`,
    });
    expect(routing.resolve(routeRef)?.({ name: 'example' })).toBe(
      '/test/example',
    );
    expect(routing.resolve).toHaveBeenCalledWith(routeRef);

    const dialog = mockApis.dialog.mock({
      open<TResult>() {
        let resolve: (value: TResult) => void;
        const result = new Promise<TResult>(r => {
          resolve = r;
        });
        return {
          close: (...args) => resolve(args[0] as TResult),
          update: () => {},
          result: () => result,
        };
      },
    });
    const handle = dialog.open<boolean>(createElement('div'));
    const result: Promise<boolean> = handle.result();
    handle.close(true);
    await expect(result).resolves.toBe(true);
    expect(dialog.open).toHaveBeenCalledTimes(1);

    const icons = mockApis.icons.mock({ listIconKeys: () => ['test'] });
    expect(icons.listIconKeys()).toEqual(['test']);
    expect(icons.listIconKeys).toHaveBeenCalledTimes(1);
  });
});
