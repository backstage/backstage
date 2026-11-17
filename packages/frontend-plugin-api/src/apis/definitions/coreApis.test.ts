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

import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { ConfigReader } from '@backstage/config';
import * as apis from '../../index';
import { appHistoryApiRef } from '../../routing/AppHistoryApi';

const { coreApis } = apis;

describe('core API references', () => {
  it('uses syntax supported by Node.js type stripping', () => {
    // This checks this export's syntax, without loading the package's dependency graph.
    const source = readFileSync(`${__dirname}/coreApis.ts`, 'utf8');
    expect(() => stripTypeScriptTypes(source, { mode: 'strip' })).not.toThrow();
  });

  it('preserves API inference in factories', () => {
    const factory = apis.createApiFactory({
      api: coreApis.config,
      deps: { config: coreApis.config },
      factory: ({ config }) => config,
    });
    const config = new ConfigReader({ app: { title: 'Test app' } });
    expect(factory.factory({ config }).getString('app.title')).toBe('Test app');
    const wrongDeps: Parameters<typeof factory.factory>[0] = {
      // @ts-expect-error The inferred dependency is ConfigApi, not any.
      config: 1,
    };
    expect(wrongDeps.config).toBe(1);
    expect(factory.deps.config).toBe(coreApis.config);

    const configId: 'core.config' = coreApis.config.id;
    expect(factory.api).toBe(coreApis.config);
    expect(configId).toBe('core.config');
  });

  it('preserves core API ref identity and metadata', () => {
    const appHistory: apis.ApiRef<apis.AppHistoryApi> = appHistoryApiRef;
    const refs = {
      appHistory,
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
    } satisfies Omit<typeof coreApis, 'internal'>;
    const typedRefs: typeof refs = coreApis;
    expect(typedRefs).toBe(coreApis);

    expect(Object.keys(coreApis).sort()).toEqual(
      [...Object.keys(refs), 'internal'].sort(),
    );
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
    } satisfies typeof coreApis.internal;
    const typedRefs: typeof refs = coreApis.internal;
    expect(typedRefs).toBe(coreApis.internal);

    expect(Object.keys(coreApis.internal).sort()).toEqual(
      Object.keys(refs).sort(),
    );
    for (const name of Object.keys(refs) as (keyof typeof refs)[]) {
      expect(coreApis.internal[name]).toBe(refs[name]);
      expect(coreApis.internal[name].id).toBe(refs[name].id);
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
      expect(Object.values(coreApis.internal)).not.toContain(ref);
    }
    expect(coreApis.internal.oauthRequest).toBe(apis.oauthRequestApiRef);
    expect(coreApis.identity).toBe(apis.identityApiRef);
  });
});
