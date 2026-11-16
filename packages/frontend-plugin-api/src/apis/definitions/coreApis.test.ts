/*
 * Copyright 2026 The Backstage Authors
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

import * as apis from '../../index';

const { coreApis, internalCoreApis } = apis;

describe('core API namespaces', () => {
  it('preserves core API ref identity and metadata', () => {
    const refs = {
      appHistory: apis.appHistoryApiRef,
      analytics: apis.analyticsApiRef,
      appLanguage: apis.appLanguageApiRef,
      appTheme: apis.appThemeApiRef,
      appTree: apis.appTreeApiRef,
      config: apis.configApiRef,
      dialog: apis.dialogApiRef,
      discovery: apis.discoveryApiRef,
      error: apis.errorApiRef,
      featureFlags: apis.featureFlagsApiRef,
      fetch: apis.fetchApiRef,
      icons: apis.iconsApiRef,
      identity: apis.identityApiRef,
      routeResolution: apis.routeResolutionApiRef,
      storage: apis.storageApiRef,
      toast: apis.toastApiRef,
      translation: apis.translationApiRef,
    };

    expect(Object.keys(coreApis).sort()).toEqual(Object.keys(refs).sort());
    for (const name of Object.keys(refs) as (keyof typeof refs)[]) {
      expect(coreApis[name]).toBe(refs[name]);
      expect(coreApis[name].id).toBe(refs[name].id);
    }
  });

  it('separates framework APIs while preserving ref identity and metadata', () => {
    const refs = {
      appLifecycle: apis.appLifecycleApiRef,
      oauthRequest: apis.oauthRequestApiRef,
      pluginHeaderActions: apis.pluginHeaderActionsApiRef,
      pluginWrapper: apis.pluginWrapperApiRef,
      swappableComponents: apis.swappableComponentsApiRef,
    };

    expect(Object.keys(internalCoreApis).sort()).toEqual(
      Object.keys(refs).sort(),
    );
    for (const name of Object.keys(refs) as (keyof typeof refs)[]) {
      expect(internalCoreApis[name]).toBe(refs[name]);
      expect(internalCoreApis[name].id).toBe(refs[name].id);
      expect(coreApis).not.toHaveProperty(name);
    }
  });

  it('excludes provider-specific authentication APIs', () => {
    const providerRefs = Object.entries(apis as Record<string, unknown>).filter(
      ([name]) => name.endsWith('AuthApiRef'),
    );
    expect(providerRefs.length).toBeGreaterThan(0);
    for (const [, ref] of providerRefs) {
      expect(Object.values(coreApis)).not.toContain(ref);
      expect(Object.values(internalCoreApis)).not.toContain(ref);
    }
    expect(internalCoreApis.oauthRequest).toBe(apis.oauthRequestApiRef);
    expect(coreApis.identity).toBe(apis.identityApiRef);
  });
});
