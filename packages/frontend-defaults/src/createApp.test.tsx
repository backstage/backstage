/*
 * Copyright 2023 The Backstage Authors
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
  AppTreeApi,
  ApiBlueprint,
  appTreeApiRef,
  coreExtensionData,
  createApiRef,
  createExtensionDataRef,
  createExtension,
  createExtensionBlueprint,
  createExtensionInput,
  PageBlueprint,
  createFrontendPlugin,
  createFrontendFeatureLoader,
  createFrontendModule,
  useAppNode,
  FrontendPluginInfo,
} from '@backstage/frontend-plugin-api';
import { ThemeBlueprint } from '@backstage/plugin-app-react';
import { act, screen, waitFor } from '@testing-library/react';
import { createApp } from './createApp';
import { mockApis, renderWithEffects } from '@backstage/test-utils';
import {
  featureFlagsApiRef,
  IdentityApi,
  useApi,
} from '@backstage/core-plugin-api';
import { default as appPluginOriginal } from '@backstage/plugin-app';
import { ComponentType, useState, useEffect } from 'react';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { AuthorizeResult } from '@backstage/plugin-permission-common';

const signInPageComponentDataRef = createExtensionDataRef<
  ComponentType<{ onSignInSuccess(identity: IdentityApi): void }>
>().with({ id: 'core.sign-in-page.component' });

describe('createApp', () => {
  const appPlugin = appPluginOriginal.withOverrides({
    extensions: [
      appPluginOriginal
        .getExtension('sign-in-page:app')
        .override({ disabled: true }),
    ],
  });

  function createFeatureFlagsApi(activeFlags: string[]) {
    return {
      isActive: jest.fn((name: string) => activeFlags.includes(name)),
      registerFlag: jest.fn(),
      getRegisteredFlags: () => [],
      save: jest.fn(),
    } as unknown as typeof featureFlagsApiRef.T;
  }

  function createPermissionApi(allowedPermissions: string[]) {
    return {
      authorize: jest.fn(async request => ({
        result: allowedPermissions.includes(request.permission.name)
          ? AuthorizeResult.ALLOW
          : AuthorizeResult.DENY,
      })),
    } as typeof permissionApiRef.T;
  }

  it('should allow themes to be installed', async () => {
    const app = createApp({
      advanced: {
        configLoader: async () => ({
          config: mockApis.config({
            data: {
              app: {
                extensions: [
                  { 'theme:app/light': false },
                  { 'theme:app/dark': false },
                ],
              },
            },
          }),
        }),
      },
      features: [
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            ThemeBlueprint.make({
              name: 'derp',
              params: {
                theme: {
                  id: 'derp',
                  title: 'Derp',
                  variant: 'dark',
                  Provider: () => <div>Derp</div>,
                },
              },
            }),
          ],
        }),
      ],
    });

    await renderWithEffects(app.createRoot());

    await expect(screen.findByText('Derp')).resolves.toBeInTheDocument();
  });

  it('should provide app APIs to sign-in pages before finalization', async () => {
    const signInApiRef = createApiRef<{ value: string }>({
      id: 'test.sign-in-api',
    });

    const app = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appPluginOriginal,
        createFrontendPlugin({
          pluginId: 'test',
          extensions: [
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: signInApiRef,
                  deps: {},
                  factory: () => ({ value: 'ok' }),
                }),
            }),
          ],
        }),
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            appPluginOriginal.getExtension('sign-in-page:app').override({
              factory: () => {
                const SignInPage = () => {
                  const api = useApi(signInApiRef);
                  return <div>Sign In API: {api.value}</div>;
                };

                return [signInPageComponentDataRef(SignInPage)];
              },
            }),
          ],
        }),
      ],
    });

    await renderWithEffects(app.createRoot());
    await expect(
      screen.findByText('Sign In API: ok'),
    ).resolves.toBeInTheDocument();
  });

  it('should provide feature flags to sign-in pages before finalization', async () => {
    const app = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appPluginOriginal,
        createFrontendPlugin({
          pluginId: 'test',
          featureFlags: [{ name: 'test-flag' }],
          extensions: [],
        }),
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            appPluginOriginal.getExtension('sign-in-page:app').override({
              factory: () => {
                const SignInPage = () => {
                  const flagsApi = useApi(featureFlagsApiRef);
                  return (
                    <div>
                      Flags:{' '}
                      {flagsApi
                        .getRegisteredFlags()
                        .map(flag => flag.name)
                        .join(', ')}
                    </div>
                  );
                };

                return [signInPageComponentDataRef(SignInPage)];
              },
            }),
          ],
        }),
      ],
    });

    await renderWithEffects(app.createRoot());
    await expect(
      screen.findByText('Flags: test-flag'),
    ).resolves.toBeInTheDocument();
  });

  it('should surface sign-in bootstrap errors through the app root boundary', async () => {
    const identityApi = {
      getProfileInfo: async () => ({ displayName: 'Test User' }),
      getBackstageIdentity: async () => ({
        type: 'user' as const,
        userEntityRef: 'user:default/test-user',
        ownershipEntityRefs: ['user:default/test-user'],
      }),
      getCredentials: async () => ({ token: 'token' }),
      signOut: async () => {},
    };
    const featureFlagsApi = {
      isActive: jest.fn(() => {
        throw new Error('sign-in bootstrap failed');
      }),
      registerFlag: jest.fn(),
      getRegisteredFlags: () => [],
      save: jest.fn(),
    } as unknown as typeof featureFlagsApiRef.T;
    let onSignInSuccess: ((identity: IdentityApi) => void) | undefined;

    const app = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appPluginOriginal,
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: featureFlagsApiRef,
                  deps: {},
                  factory: () => featureFlagsApi,
                }),
            }),
            appPluginOriginal.getExtension('sign-in-page:app').override({
              factory: () => {
                function SignInPage(props: {
                  onSignInSuccess(identity: IdentityApi): void;
                }) {
                  onSignInSuccess = props.onSignInSuccess;

                  return <div>Custom Sign In</div>;
                }

                return [signInPageComponentDataRef(SignInPage)];
              },
            }),
          ],
        }),
        createFrontendPlugin({
          pluginId: 'test',
          featureFlags: [{ name: 'test-flag' }],
          extensions: [
            PageBlueprint.make({
              if: { featureFlags: { $contains: 'test-flag' } },
              params: {
                path: '/',
                loader: async () => <div>Flagged Page</div>,
              },
            }),
          ],
        }),
      ],
    });

    await renderWithEffects(app.createRoot());
    await expect(
      screen.findByText('Custom Sign In'),
    ).resolves.toBeInTheDocument();
    if (!onSignInSuccess) {
      throw new Error('Expected sign-in success callback to be captured');
    }
    const triggerSignInSuccess = onSignInSuccess;
    act(() => {
      triggerSignInSuccess(identityApi);
    });

    await expect(
      screen.findByText('sign-in bootstrap failed'),
    ).resolves.toBeInTheDocument();
  });

  it('should deduplicate features keeping the last received one', async () => {
    const duplicatedFeatureId = 'test';
    const app = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        createFrontendPlugin({
          pluginId: duplicatedFeatureId,
          extensions: [
            PageBlueprint.make({
              params: {
                path: '/',
                loader: async () => <div>First Page</div>,
              },
            }),
          ],
        }),
        createFrontendPlugin({
          pluginId: duplicatedFeatureId,
          extensions: [
            PageBlueprint.make({
              params: {
                path: '/',
                loader: async () => <div>Last Page</div>,
              },
            }),
          ],
        }),
        appPlugin,
      ],
    });

    await renderWithEffects(app.createRoot());

    await waitFor(() =>
      expect(screen.queryByText('First Page')).not.toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.getByText('Last Page')).toBeInTheDocument(),
    );
  });

  it('should allow overriding the plugin info resolver', async () => {
    function TestComponent() {
      const appNode = useAppNode();
      const [info, setInfo] = useState<FrontendPluginInfo | undefined>(
        undefined,
      );

      useEffect(() => {
        appNode?.spec.plugin?.info().then(setInfo);
      }, [appNode]);

      return <div>Package name: {info?.packageName}</div>;
    }

    const app = createApp({
      features: [
        appPlugin,
        createFrontendPlugin({
          pluginId: 'test',
          extensions: [
            PageBlueprint.make({
              params: {
                path: '/',
                loader: async () => <TestComponent />,
              },
            }),
          ],
        }),
      ],
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
        pluginInfoResolver: async () => {
          return {
            info: {
              packageName: '@test/test',
            },
          };
        },
      },
    });

    await renderWithEffects(app.createRoot());

    await expect(
      screen.findByText('Package name: @test/test'),
    ).resolves.toBeInTheDocument();
  });

  it('should support feature loaders', async () => {
    const loader = createFrontendFeatureLoader({
      async *loader({ config }) {
        yield createFrontendPlugin({
          pluginId: 'test',
          extensions: [
            PageBlueprint.make({
              params: {
                path: '/',
                loader: async () => <div>{config.getString('key')}</div>,
              },
            }),
          ],
        });
      },
    });

    const app = createApp({
      advanced: {
        configLoader: async () => ({
          config: mockApis.config({ data: { key: 'config-value' } }),
        }),
      },
      features: [appPlugin, loader],
    });

    await renderWithEffects(app.createRoot());

    await expect(
      screen.findByText('config-value'),
    ).resolves.toBeInTheDocument();
  });

  it('should propagate errors thrown by feature loaders', async () => {
    const loader = createFrontendFeatureLoader({
      async loader() {
        throw new TypeError('boom');
      },
    });

    const app = createApp({
      advanced: {
        configLoader: async () => ({
          config: mockApis.config(),
        }),
      },
      features: [loader],
    });

    await expect(renderWithEffects(app.createRoot())).rejects.toThrow(
      /Failed to read frontend features from loader created at '.*\/createApp\.test\.tsx:\d+:\d+': TypeError: boom/,
    );
  });

  it('should register feature flags', async () => {
    const app = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appPlugin.withOverrides({
          extensions: [
            appPlugin
              .getExtension('app/root')
              .override({ disabled: true, factory: orig => orig() }),
          ],
        }),
        createFrontendPlugin({
          pluginId: 'test',
          featureFlags: [{ name: 'test-1' }],
          extensions: [
            createExtension({
              name: 'first',
              attachTo: { id: 'app', input: 'root' },
              output: [coreExtensionData.reactElement],
              factory() {
                const Component = () => {
                  const flagsApi = useApi(featureFlagsApiRef);
                  return (
                    <div>
                      Flags:{' '}
                      {flagsApi
                        .getRegisteredFlags()
                        .map(flag => `${flag.name} from '${flag.pluginId}'`)
                        .join(', ')}
                    </div>
                  );
                };
                return [coreExtensionData.reactElement(<Component />)];
              },
            }),
          ],
        }),
        createFrontendPlugin({
          pluginId: 'other',
          featureFlags: [{ name: 'test-2' }],
          extensions: [],
        }),
      ],
    });

    await renderWithEffects(app.createRoot());

    await expect(
      screen.findByText("Flags: test-1 from 'test', test-2 from 'other'"),
    ).resolves.toBeInTheDocument();
  });

  it('should evaluate extension if predicates before rendering apps without sign-in', async () => {
    const featureFlagsApi = {
      isActive: jest.fn((name: string) => name === 'test-flag'),
      registerFlag: jest.fn(),
      getRegisteredFlags: () => [],
      save: jest.fn(),
    } as unknown as typeof featureFlagsApiRef.T;
    const app = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appPlugin,
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: featureFlagsApiRef,
                  deps: {},
                  factory: () => featureFlagsApi,
                }),
            }),
          ],
        }),
        createFrontendPlugin({
          pluginId: 'test',
          featureFlags: [{ name: 'test-flag' }],
          extensions: [
            PageBlueprint.make({
              if: { featureFlags: { $contains: 'test-flag' } },
              params: {
                path: '/',
                loader: async () => <div>Flagged Page</div>,
              },
            }),
          ],
        }),
      ],
    });

    await renderWithEffects(app.createRoot());

    await expect(
      screen.findByText('Flagged Page'),
    ).resolves.toBeInTheDocument();
    expect(featureFlagsApi.isActive).toHaveBeenCalledWith('test-flag');
  });

  it('should support $all feature flag predicates on pages', async () => {
    const partialFlagsApi = createFeatureFlagsApi(['experimental-features']);
    const partialFlagsApp = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appPlugin,
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: featureFlagsApiRef,
                  deps: {},
                  factory: () => partialFlagsApi,
                }),
            }),
          ],
        }),
        createFrontendPlugin({
          pluginId: 'test',
          featureFlags: [
            { name: 'experimental-features' },
            { name: 'advanced-features' },
          ],
          extensions: [
            PageBlueprint.make({
              if: {
                $all: [
                  { featureFlags: { $contains: 'experimental-features' } },
                  { featureFlags: { $contains: 'advanced-features' } },
                ],
              },
              params: {
                path: '/',
                loader: async () => <div>All Flags Page</div>,
              },
            }),
          ],
        }),
      ],
    });

    const partialRender = await renderWithEffects(partialFlagsApp.createRoot());
    await waitFor(() =>
      expect(screen.queryByText('All Flags Page')).not.toBeInTheDocument(),
    );
    partialRender.unmount();

    const allFlagsApi = createFeatureFlagsApi([
      'experimental-features',
      'advanced-features',
    ]);
    const allFlagsApp = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appPlugin,
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: featureFlagsApiRef,
                  deps: {},
                  factory: () => allFlagsApi,
                }),
            }),
          ],
        }),
        createFrontendPlugin({
          pluginId: 'test',
          featureFlags: [
            { name: 'experimental-features' },
            { name: 'advanced-features' },
          ],
          extensions: [
            PageBlueprint.make({
              if: {
                $all: [
                  { featureFlags: { $contains: 'experimental-features' } },
                  { featureFlags: { $contains: 'advanced-features' } },
                ],
              },
              params: {
                path: '/',
                loader: async () => <div>All Flags Page</div>,
              },
            }),
          ],
        }),
      ],
    });

    await renderWithEffects(allFlagsApp.createRoot());
    await expect(
      screen.findByText('All Flags Page'),
    ).resolves.toBeInTheDocument();
    expect(allFlagsApi.isActive).toHaveBeenCalledWith('experimental-features');
    expect(allFlagsApi.isActive).toHaveBeenCalledWith('advanced-features');
  });

  it('should support $any feature flag predicates on pages', async () => {
    const noFlagsApi = createFeatureFlagsApi([]);
    const noFlagsApp = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appPlugin,
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: featureFlagsApiRef,
                  deps: {},
                  factory: () => noFlagsApi,
                }),
            }),
          ],
        }),
        createFrontendPlugin({
          pluginId: 'test',
          featureFlags: [
            { name: 'experimental-features' },
            { name: 'beta-access' },
          ],
          extensions: [
            PageBlueprint.make({
              if: {
                $any: [
                  { featureFlags: { $contains: 'experimental-features' } },
                  { featureFlags: { $contains: 'beta-access' } },
                ],
              },
              params: {
                path: '/',
                loader: async () => <div>Any Flag Page</div>,
              },
            }),
          ],
        }),
      ],
    });

    const noFlagsRender = await renderWithEffects(noFlagsApp.createRoot());
    await waitFor(() =>
      expect(screen.queryByText('Any Flag Page')).not.toBeInTheDocument(),
    );
    noFlagsRender.unmount();

    const oneFlagApi = createFeatureFlagsApi(['beta-access']);
    const oneFlagApp = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appPlugin,
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: featureFlagsApiRef,
                  deps: {},
                  factory: () => oneFlagApi,
                }),
            }),
          ],
        }),
        createFrontendPlugin({
          pluginId: 'test',
          featureFlags: [
            { name: 'experimental-features' },
            { name: 'beta-access' },
          ],
          extensions: [
            PageBlueprint.make({
              if: {
                $any: [
                  { featureFlags: { $contains: 'experimental-features' } },
                  { featureFlags: { $contains: 'beta-access' } },
                ],
              },
              params: {
                path: '/',
                loader: async () => <div>Any Flag Page</div>,
              },
            }),
          ],
        }),
      ],
    });

    await renderWithEffects(oneFlagApp.createRoot());
    await expect(
      screen.findByText('Any Flag Page'),
    ).resolves.toBeInTheDocument();
    expect(oneFlagApi.isActive).toHaveBeenCalledWith('experimental-features');
    expect(oneFlagApi.isActive).toHaveBeenCalledWith('beta-access');
  });

  it('should support permission predicates on pages', async () => {
    const deniedPermissionApi = createPermissionApi([]);
    const deniedApp = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appPlugin,
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: permissionApiRef,
                  deps: {},
                  factory: () => deniedPermissionApi,
                }),
            }),
          ],
        }),
        createFrontendPlugin({
          pluginId: 'test',
          extensions: [
            PageBlueprint.make({
              if: { permissions: { $contains: 'catalog.entity.create' } },
              params: {
                path: '/',
                loader: async () => <div>Permission Page</div>,
              },
            }),
          ],
        }),
      ],
    });

    const deniedRender = await renderWithEffects(deniedApp.createRoot());
    await waitFor(() =>
      expect(screen.queryByText('Permission Page')).not.toBeInTheDocument(),
    );
    deniedRender.unmount();

    const allowedPermissionApi = createPermissionApi(['catalog.entity.create']);
    const allowedApp = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appPlugin,
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            ApiBlueprint.make({
              params: defineParams =>
                defineParams({
                  api: permissionApiRef,
                  deps: {},
                  factory: () => allowedPermissionApi,
                }),
            }),
          ],
        }),
        createFrontendPlugin({
          pluginId: 'test',
          extensions: [
            PageBlueprint.make({
              if: { permissions: { $contains: 'catalog.entity.create' } },
              params: {
                path: '/',
                loader: async () => <div>Permission Page</div>,
              },
            }),
          ],
        }),
      ],
    });

    await renderWithEffects(allowedApp.createRoot());
    await expect(
      screen.findByText('Permission Page'),
    ).resolves.toBeInTheDocument();
    expect(allowedPermissionApi.authorize).toHaveBeenCalledWith({
      permission: {
        name: 'catalog.entity.create',
        type: 'basic',
        attributes: {},
      },
    });
  });

  it('should support conditional child extensions attached to pages', async () => {
    const CardBlueprint = createExtensionBlueprint({
      kind: 'card',
      attachTo: { id: 'page:test/card-page', input: 'cards' },
      output: [coreExtensionData.reactElement],
      *factory(params: { title: string }) {
        yield coreExtensionData.reactElement(<div>{params.title}</div>);
      },
    });

    const page = PageBlueprint.makeWithOverrides({
      name: 'card-page',
      inputs: {
        cards: createExtensionInput([coreExtensionData.reactElement], {
          optional: false,
          singleton: false,
        }),
      },
      factory(originalFactory, { inputs }) {
        return originalFactory({
          path: '/',
          loader: async () => (
            <div>
              {inputs.cards.map(card =>
                card.get(coreExtensionData.reactElement),
              )}
            </div>
          ),
        });
      },
    });

    const publicCard = CardBlueprint.make({
      name: 'public',
      params: { title: 'Public Card' },
    });
    const permissionCard = CardBlueprint.make({
      name: 'permission',
      params: { title: 'Permission Card' },
      if: { permissions: { $contains: 'catalog.entity.create' } },
    });
    const featureFlagCard = CardBlueprint.make({
      name: 'feature-flag',
      params: { title: 'Feature Flag Card' },
      if: { featureFlags: { $contains: 'experimental-card' } },
    });

    const hiddenCardsApp = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appPlugin,
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            ApiBlueprint.make({
              name: 'permission-api',
              params: defineParams =>
                defineParams({
                  api: permissionApiRef,
                  deps: {},
                  factory: () => createPermissionApi([]),
                }),
            }),
            ApiBlueprint.make({
              name: 'feature-flags-api',
              params: defineParams =>
                defineParams({
                  api: featureFlagsApiRef,
                  deps: {},
                  factory: () => createFeatureFlagsApi([]),
                }),
            }),
          ],
        }),
        createFrontendPlugin({
          pluginId: 'test',
          featureFlags: [{ name: 'experimental-card' }],
          extensions: [page, publicCard, permissionCard, featureFlagCard],
        }),
      ],
    });

    const hiddenCardsRender = await renderWithEffects(
      hiddenCardsApp.createRoot(),
    );
    await expect(screen.findByText('Public Card')).resolves.toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText('Permission Card')).not.toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.queryByText('Feature Flag Card')).not.toBeInTheDocument(),
    );
    hiddenCardsRender.unmount();

    const visibleCardsApp = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appPlugin,
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            ApiBlueprint.make({
              name: 'permission-api',
              params: defineParams =>
                defineParams({
                  api: permissionApiRef,
                  deps: {},
                  factory: () => createPermissionApi(['catalog.entity.create']),
                }),
            }),
            ApiBlueprint.make({
              name: 'feature-flags-api',
              params: defineParams =>
                defineParams({
                  api: featureFlagsApiRef,
                  deps: {},
                  factory: () => createFeatureFlagsApi(['experimental-card']),
                }),
            }),
          ],
        }),
        createFrontendPlugin({
          pluginId: 'test',
          featureFlags: [{ name: 'experimental-card' }],
          extensions: [page, publicCard, permissionCard, featureFlagCard],
        }),
      ],
    });

    await renderWithEffects(visibleCardsApp.createRoot());
    await expect(
      screen.findByText('Permission Card'),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText('Feature Flag Card'),
    ).resolves.toBeInTheDocument();
  });

  it('should make the app structure available through the AppTreeApi', async () => {
    let appTreeApi: AppTreeApi | undefined = undefined;

    const app = createApp({
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
      },
      features: [
        appPlugin,
        createFrontendPlugin({
          pluginId: 'my-plugin',
          extensions: [
            PageBlueprint.make({
              params: {
                path: '/',
                loader: async () => {
                  const Component = () => {
                    appTreeApi = useApi(appTreeApiRef);
                    return <div>My Plugin Page</div>;
                  };
                  return <Component />;
                },
              },
            }),
          ],
        }),
      ],
    });

    await renderWithEffects(app.createRoot());

    expect(appTreeApi).toBeDefined();
    const { tree } = appTreeApi!.getTree();

    expect(String(tree.root)).toMatchInlineSnapshot(`
      "<root out=[core.reactElement]>
        apis [
          <api:app/dialog out=[core.api.factory] />
          <api:app/discovery out=[core.api.factory] />
          <api:app/alert out=[core.api.factory] />
          <api:app/toast-forwarder out=[core.api.factory] />
          <api:app/toast out=[core.api.factory] />
          <api:app/analytics out=[core.api.factory] />
          <api:app/error out=[core.api.factory] />
          <api:app/storage out=[core.api.factory] />
          <api:app/fetch out=[core.api.factory] />
          <api:app/oauth-request out=[core.api.factory] />
          <api:app/google-auth out=[core.api.factory] />
          <api:app/microsoft-auth out=[core.api.factory] />
          <api:app/github-auth out=[core.api.factory] />
          <api:app/okta-auth out=[core.api.factory] />
          <api:app/gitlab-auth out=[core.api.factory] />
          <api:app/onelogin-auth out=[core.api.factory] />
          <api:app/bitbucket-auth out=[core.api.factory] />
          <api:app/bitbucket-server-auth out=[core.api.factory] />
          <api:app/atlassian-auth out=[core.api.factory] />
          <api:app/vmware-cloud-auth out=[core.api.factory] />
          <api:app/openshift-auth out=[core.api.factory] />
          <api:app/permission out=[core.api.factory] />
          <api:app/scm-auth out=[core.api.factory] />
          <api:app/scm-integrations out=[core.api.factory] />
          <api:app/app-language out=[core.api.factory] />
          <api:app/app-theme out=[core.api.factory]>
            themes [
              <theme:app/dark out=[core.theme.theme] />
              <theme:app/light out=[core.theme.theme] />
            ]
          </api:app/app-theme>
          <api:app/swappable-components out=[core.api.factory]>
            components [
              <component:app/core-progress out=[core.swappableComponent] />
              <component:app/core-not-found-error-page out=[core.swappableComponent] />
              <component:app/core-error-display out=[core.swappableComponent] />
              <component:app/core-page-layout out=[core.swappableComponent] />
            ]
          </api:app/swappable-components>
          <api:app/icons out=[core.api.factory] />
          <api:app/feature-flags out=[core.api.factory] />
          <api:app/plugin-wrapper out=[core.api.factory] />
          <api:app/plugin-header-actions out=[core.api.factory] />
          <api:app/translations out=[core.api.factory] />
          <api:app/components out=[core.api.factory] />
        ]
        app [
          <app out=[core.reactElement]>
            root [
              <app/root out=[core.reactElement]>
                children [
                  <app/layout out=[core.reactElement]>
                    nav [
                      <app/nav out=[core.reactElement] />
                    ]
                    content [
                      <app/routes out=[core.reactElement]>
                        routes [
                          <page:my-plugin out=[core.routing.path, core.reactElement] />
                        ]
                      </app/routes>
                    ]
                  </app/layout>
                ]
                elements [
                  <app-root-element:app/oauth-request-dialog out=[core.reactElement] />
                  <app-root-element:app/alert-display out=[core.reactElement] />
                  <app-root-element:app/dialog-display out=[core.reactElement] />
                ]
              </app/root>
            ]
          </app>
        ]
      </root>"
    `);
  });

  it('should use <Progress /> as the default suspense fallback', async () => {
    const app = createApp({
      advanced: {
        configLoader: () => new Promise(() => {}),
      },
    });

    await renderWithEffects(app.createRoot());

    await expect(screen.findByTestId('progress')).resolves.toBeInTheDocument();
  });

  it('should use no suspense fallback if the loadingElement is null', async () => {
    const app = createApp({
      advanced: {
        configLoader: () => new Promise(() => {}),
        loadingElement: null,
      },
    });

    await renderWithEffects(app.createRoot());

    expect(screen.queryByTestId('progress')).toBeNull();
  });

  it('should use a custom loadingElement', async () => {
    const app = createApp({
      advanced: {
        configLoader: () => new Promise(() => {}),
        loadingElement: <span>Custom loading message</span>,
      },
    });

    await renderWithEffects(app.createRoot());

    expect(screen.queryByText('Custom loading message')).toBeInTheDocument();
  });

  it('should allow overriding the app plugin', async () => {
    const app = createApp({
      advanced: {
        configLoader: () => new Promise(() => {}),
      },
      features: [
        appPlugin.withOverrides({
          extensions: [
            appPlugin.getExtension('app/root').override({
              factory: () => [
                coreExtensionData.reactElement(
                  <div>Custom app root element</div>,
                ),
              ],
            }),
          ],
        }),
      ],
    });

    await renderWithEffects(app.createRoot());

    expect(screen.queryByText('Custom app root element')).toBeNull();
  });

  it('should use a custom extensionFactoryMiddleware', async () => {
    const app = createApp({
      features: [
        appPlugin,
        createFrontendPlugin({
          pluginId: 'test-plugin',
          extensions: [
            PageBlueprint.make({
              name: 'test-page',
              params: {
                path: '/',
                loader: async () => <>Test Page</>,
              },
            }),
          ],
        }),
      ],
      advanced: {
        configLoader: async () => ({ config: mockApis.config() }),
        *extensionFactoryMiddleware(originalFactory, context) {
          const output = originalFactory();
          yield* output;
          const element = output.get(coreExtensionData.reactElement);

          if (element) {
            yield coreExtensionData.reactElement(
              <div data-testid={`wrapped(${context.node.spec.id})`}>
                {element}
              </div>,
            );
          }
        },
      },
    });

    await renderWithEffects(app.createRoot());

    await expect(
      screen.findByTestId('wrapped(page:test-plugin/test-page)'),
    ).resolves.toHaveTextContent('Test Page');
  });

  describe('modules', () => {
    it('should be able to override extensions with a plugin extension override', async () => {
      const mod = createFrontendModule({
        pluginId: 'app',
        extensions: [
          appPlugin.getExtension('app/root').override({
            factory: () => [
              coreExtensionData.reactElement(
                <div>Custom app root element</div>,
              ),
            ],
          }),
        ],
      });

      const app = createApp({
        advanced: {
          configLoader: () => new Promise(() => {}),
        },
        features: [mod],
      });

      await renderWithEffects(app.createRoot());

      expect(screen.queryByText('Custom app root element')).toBeNull();
    });

    it('should be able to override extensions with a standalone extension override', async () => {
      const mod = createFrontendModule({
        pluginId: 'app',
        extensions: [
          createExtension({
            name: 'root',
            attachTo: { id: 'app', input: 'root' },
            output: [coreExtensionData.reactElement],
            factory: () => [
              coreExtensionData.reactElement(
                <div>Custom app root element</div>,
              ),
            ],
          }),
        ],
      });

      const app = createApp({
        advanced: {
          configLoader: () => new Promise(() => {}),
        },
        features: [mod],
      });

      await renderWithEffects(app.createRoot());

      expect(screen.queryByText('Custom app root element')).toBeNull();
    });
  });
});
