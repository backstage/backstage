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

import { ComponentType } from 'react';
import {
  ApiBlueprint,
  ErrorDisplayProps,
  createExtension,
  createFrontendModule,
  ExtensionDefinition,
  FrontendModule,
  ErrorDisplay as SwappableErrorDisplay,
  NotFoundErrorPage as SwappableNotFoundErrorPage,
  Progress as SwappableProgress,
} from '@backstage/frontend-plugin-api';
import {
  IconBundleBlueprint,
  RouterBlueprint,
  SignInPageBlueprint,
  SwappableComponentBlueprint,
  ThemeBlueprint,
} from '@backstage/plugin-app-react';
import {
  AnyApiFactory,
  AppComponents,
  AppTheme,
  BackstagePlugin,
  FeatureFlag,
  IconComponent,
} from '@backstage/core-plugin-api';
import { toLegacyPlugin } from './compatWrapper/BackwardsCompatProvider';
import { compatWrapper } from './compatWrapper';

function componentCompatWrapper<TProps extends {}>(
  Component: ComponentType<TProps>,
) {
  return (props: TProps) => compatWrapper(<Component {...props} />);
}

/**
 * @public
 */
export function convertLegacyAppOptions(
  options: {
    apis?: Iterable<AnyApiFactory>;

    icons?: { [key in string]: IconComponent };

    plugins?: Array<BackstagePlugin>;

    components?: Partial<AppComponents>;

    themes?: AppTheme[];

    featureFlags?: (FeatureFlag & Omit<FeatureFlag, 'pluginId'>)[];
  } = {},
): FrontendModule {
  const { apis, icons, plugins, components, themes, featureFlags } = options;

  const allApis = [
    ...(plugins?.flatMap(plugin => [...plugin.getApis()]) ?? []),
    ...(apis ?? []),
  ];
  const deduplicatedApis = Array.from(
    new Map(allApis.map(api => [api.api.id, api])).values(),
  );
  const extensions: ExtensionDefinition[] = deduplicatedApis.map(factory =>
    ApiBlueprint.make({
      name: factory.api.id,
      params: defineParams => defineParams(factory),
    }),
  );

  if (icons) {
    extensions.push(
      IconBundleBlueprint.make({
        name: 'app-options',
        params: { icons },
      }),
    );
  }

  if (themes) {
    // IF any themes are provided we need to disable the default ones, unless they are overridden
    for (const id of ['light', 'dark']) {
      if (!themes.some(theme => theme.id === id)) {
        extensions.push(
          createExtension({
            kind: 'theme',
            name: id,
            attachTo: { id: 'api:app/app-theme', input: 'themes' },
            disabled: true,
            output: [],
            factory: () => [],
          }),
        );
      }
    }
    extensions.push(
      ...themes.map(theme =>
        ThemeBlueprint.make({
          name: theme.id,
          params: { theme },
        }),
      ),
    );
  }

  if (components) {
    const {
      BootErrorPage,
      ErrorBoundaryFallback,
      NotFoundErrorPage,
      Progress,
      Router,
      SignInPage,
      ThemeProvider,
    } = components;

    if (BootErrorPage) {
      throw new Error(
        'components.BootErrorPage is not supported by convertLegacyAppOptions',
      );
    }
    if (ThemeProvider) {
      throw new Error(
        'components.ThemeProvider is not supported by convertLegacyAppOptions',
      );
    }
    if (Router) {
      extensions.push(
        RouterBlueprint.make({
          params: { component: componentCompatWrapper(Router) },
        }),
      );
    }
    if (SignInPage) {
      extensions.push(
        SignInPageBlueprint.make({
          params: {
            loader: () => Promise.resolve(componentCompatWrapper(SignInPage)),
          },
        }),
      );
    }
    if (Progress) {
      extensions.push(
        SwappableComponentBlueprint.make({
          params: define =>
            define({
              component: SwappableProgress,
              loader: () => componentCompatWrapper(Progress),
            }),
        }),
      );
    }

    if (NotFoundErrorPage) {
      extensions.push(
        SwappableComponentBlueprint.make({
          params: define =>
            define({
              component: SwappableNotFoundErrorPage,
              loader: () => componentCompatWrapper(NotFoundErrorPage),
            }),
        }),
      );
    }

    if (ErrorBoundaryFallback) {
      const WrappedErrorBoundaryFallback = (props: ErrorDisplayProps) =>
        compatWrapper(
          <ErrorBoundaryFallback
            {...props}
            plugin={props.plugin && toLegacyPlugin(props.plugin)}
          />,
        );

      extensions.push(
        SwappableComponentBlueprint.make({
          params: define =>
            define({
              component: SwappableErrorDisplay,
              loader: () =>
                componentCompatWrapper(WrappedErrorBoundaryFallback),
            }),
        }),
      );
    }
  }

  return createFrontendModule({
    pluginId: 'app',
    extensions,
    featureFlags,
  });
}
