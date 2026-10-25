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
      }
    }
    expect(getMockApiFactory(mockApis.permission.mock())?.api.id).toBe(
      'plugin.permission.api',
    );
  });

  it('provides usable defaults for app state, observables and toast handles', async () => {
    const language = mockApis.appLanguage.mock();
    expect(language.getAvailableLanguages()).toEqual({ languages: ['en'] });
    expect(language.getLanguage()).toEqual({ language: 'en' });
    const languageListener = jest.fn();
    const languageSubscription = language
      .language$()
      .subscribe(languageListener);
    await Promise.resolve();
    expect(languageListener).toHaveBeenCalledWith({ language: 'en' });
    languageSubscription.unsubscribe();

    const theme = mockApis.appTheme.mock();
    expect(theme.getInstalledThemes()).toEqual([]);
    expect(theme.getActiveThemeId()).toBeUndefined();
    const themeListener = jest.fn();
    theme.activeThemeId$().subscribe(themeListener);
    await Promise.resolve();
    expect(themeListener).toHaveBeenCalledWith(undefined);

    const lifecycle = mockApis.appLifecycle.mock();
    expect(lifecycle.isFinalized()).toBe(true);
    expect(() => lifecycle.subscribe(jest.fn())()).not.toThrow();
    expect(mockApis.appTree.mock().getNodesByRoutePath('/')).toEqual({
      nodes: [],
    });
    expect(mockApis.icons.mock().listIconKeys()).toEqual([]);
    expect(mockApis.icons.mock().icon('missing')).toBeUndefined();
    expect(
      mockApis.pluginHeaderActions.mock().getPluginHeaderActions('test'),
    ).toEqual([]);

    const authListener = jest.fn();
    mockApis.oauthRequest.mock().authRequest$().subscribe(authListener);
    await Promise.resolve();
    expect(authListener).toHaveBeenCalledWith([]);

    const toast = mockApis.toast.mock();
    const handle = toast.post({ title: 'Test' });
    handle.close();
    expect(handle.close).toHaveBeenCalledTimes(1);
    expect(toast.post).toHaveBeenCalledWith({ title: 'Test' });
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
