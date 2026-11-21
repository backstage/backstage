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

import { ApiBlueprint } from '../blueprints/ApiBlueprint';
import { PageBlueprint } from '../blueprints/PageBlueprint';
import { SubPageBlueprint } from '../blueprints/SubPageBlueprint';
import { createApiRef } from '../apis';
import { createRouteRef, RouteRef } from '../routing';
import { coreExtensionData } from './coreExtensionData';
import { ExtensionDefinition } from './createExtension';
import { createExtensionBlueprint } from './createExtensionBlueprint';
import { createFrontendPlugin } from './createFrontendPlugin';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B
  ? 1
  : 2
  ? true
  : false;

type LiteralsOf<T> = T extends ExtensionDefinition<infer P>
  ? P['literals']
  : never;

const routeRef = createRouteRef();
const dynamicPath: string = String('/dynamic');

const page = PageBlueprint.make({
  params: {
    path: '/lazy-demo',
    title: 'Lazy Demo',
    routeRef,
    loader: async () => null as any,
  },
});

const rootRouteRef = createRouteRef({ id: 'lazy-demo.root' });
const pageWithRouteId = PageBlueprint.make({
  name: 'with-id',
  params: { path: '/with-id', routeRef: rootRouteRef },
});

const dynamicPage = PageBlueprint.make({
  name: 'dynamic',
  disabled: true,
  if: { $all: [{ featureFlag: 'demo' }] },
  params: { path: dynamicPath, icon: null as any },
});

const subPage = SubPageBlueprint.make({
  attachTo: { id: 'page:lazy-demo', input: 'pages' },
  name: 'overview',
  params: {
    path: 'overview',
    title: 'Overview',
    loader: async () => null as any,
  },
});

const inputSubPage = SubPageBlueprint.make({
  attachTo: page.inputs.pages,
  name: 'settings',
  params: {
    path: 'settings',
    title: 'Settings',
    loader: async () => null as any,
  },
});

const testApiRef = createApiRef<{ x: string }>().with({ id: 'test.api' });
const depApiRef = createApiRef<{ y: string }>().with({ id: 'test.dep' });
const api = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: testApiRef,
      deps: { dep: depApiRef },
      factory: ({ dep }) => ({ x: dep.y }),
    }),
});
const lazyApiRef = createApiRef<Promise<{ x: string }>>().with({
  id: 'test.lazy',
});
const lazyApi = ApiBlueprint.make({
  name: 'lazy',
  params: defineParams =>
    defineParams({
      api: lazyApiRef,
      deps: {},
      factory: async () => ({ x: 'lazy' }),
    }),
});

const CustomPageBlueprint = createExtensionBlueprint({
  kind: 'page',
  attachTo: { id: 'app/routes', input: 'routes' },
  output: [coreExtensionData.routePath],
  *factory(params: { path: string }) {
    yield coreExtensionData.routePath(params.path);
  },
});
const customPage = CustomPageBlueprint.make({
  name: 'custom',
  params: { path: '/custom' },
});

const plugin = createFrontendPlugin({
  pluginId: 'lazy-demo',
  title: 'Lazy Demo',
  extensions: [subPage, page, dynamicPage],
});
const pluginFromVariable = createFrontendPlugin({
  pluginId: 'lazy-demo',
  extensions: [page, subPage] as ExtensionDefinition[],
});

PageBlueprint.make({
  // @ts-expect-error unknown params are still rejected
  params: { path: '/x', bogus: 1 },
});

PageBlueprint.make({
  // @ts-expect-error params of the wrong type are still rejected
  params: { path: 1 },
});

// Extra props on params held in a variable are allowed, as before
const prebuiltParams = { path: '/prebuilt', extra: 1 };
PageBlueprint.make({ params: prebuiltParams });

const constParams = { path: '/prebuilt', extra: 1 } as const;
PageBlueprint.make({
  // @ts-expect-error behavior change: extra props on a readonly params
  // variable, such as one declared `as const`, were previously allowed
  params: constParams,
});

type PluginLiteralsOf<T> = T extends { literals?: infer L } ? L : never;

describe('ExtensionDefinitionLiterals', () => {
  it('captures literal values in the types of extensions and plugins', () => {
    const checks: [
      Equal<
        LiteralsOf<typeof page>,
        {
          blueprint: '@backstage/frontend-plugin-api#PageBlueprint';
          params: { path: '/lazy-demo'; title: 'Lazy Demo' };
          paramKeys: 'path' | 'title' | 'routeRef' | 'loader';
          paramsCallback: undefined;
          attachTo: undefined;
          disabled: undefined;
          if: undefined;
        }
      >,
      // A route ref is only recorded if it was created with an ID
      Equal<
        LiteralsOf<typeof pageWithRouteId>['params'],
        { path: '/with-id'; routeRef: { id: 'lazy-demo.root' } }
      >,
      Equal<
        typeof rootRouteRef,
        RouteRef<undefined> & { readonly I: 'lazy-demo.root' }
      >,
      Equal<typeof routeRef, RouteRef<undefined>>,
      Equal<LiteralsOf<typeof dynamicPage>['params'], {}>,
      Equal<LiteralsOf<typeof dynamicPage>['paramKeys'], 'path' | 'icon'>,
      Equal<LiteralsOf<typeof dynamicPage>['disabled'], true>,
      Equal<
        LiteralsOf<typeof dynamicPage>['if'],
        { readonly $all: [{ readonly featureFlag: 'demo' }] }
      >,
      Equal<
        LiteralsOf<typeof subPage>['attachTo'],
        { id: 'page:lazy-demo'; input: 'pages' }
      >,
      Equal<
        LiteralsOf<typeof subPage>['blueprint'],
        '@backstage/frontend-plugin-api#SubPageBlueprint'
      >,
      Equal<LiteralsOf<typeof inputSubPage>['attachTo'], unknown>,
      Equal<
        LiteralsOf<typeof api>['paramsCallback'],
        { apiRefId: 'test.api'; apiIsPromise: false; deps: { dep: 'test.dep' } }
      >,
      Equal<
        LiteralsOf<typeof lazyApi>['paramsCallback'],
        { apiRefId: 'test.lazy'; apiIsPromise: true; deps: {} }
      >,
      Equal<
        LiteralsOf<typeof api>['blueprint'],
        '@backstage/frontend-plugin-api#ApiBlueprint'
      >,
      Equal<LiteralsOf<typeof customPage>['blueprint'], undefined>,
      Equal<
        PluginLiteralsOf<typeof plugin>,
        {
          pluginId: 'lazy-demo';
          title: 'Lazy Demo';
          if: undefined;
          extensionIds: [
            'sub-page:lazy-demo/overview',
            'page:lazy-demo',
            'page:lazy-demo/dynamic',
          ];
        }
      >,
      Equal<
        NonNullable<
          PluginLiteralsOf<typeof pluginFromVariable>
        >['extensionIds'],
        never[]
      >,
    ] = [
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ];
    expect(checks.every(Boolean)).toBe(true);
  });
});
