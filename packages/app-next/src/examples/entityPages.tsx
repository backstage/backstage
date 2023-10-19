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

import React, { useEffect } from 'react';
import { convertLegacyRouteRef } from '@backstage/core-plugin-api/alpha';
import {
  AnyExtensionInputMap,
  Extension,
  ExtensionBoundary,
  ExtensionInputValues,
  PortableSchema,
  RouteRef,
  coreExtensionData,
  createExtension,
  createExtensionDataRef,
  createExtensionInput,
  createPageExtension,
  createPlugin,
  createSchemaFromZod,
} from '@backstage/frontend-plugin-api';
import {
  AsyncEntityProvider,
  EntityLoadingStatus,
  catalogApiRef,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { Expand } from '../../../frontend-plugin-api/src/types';
import { EntityAboutCard, EntityLayout } from '@backstage/plugin-catalog';
import {
  useApi,
  errorApiRef,
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import { useNavigate } from 'react-router';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import Grid from '@material-ui/core/Grid';

export const useEntityFromUrl = (): EntityLoadingStatus => {
  const { kind, namespace, name } = useRouteRefParams(entityRouteRef);
  const navigate = useNavigate();
  const errorApi = useApi(errorApiRef);
  const catalogApi = useApi(catalogApiRef);

  const {
    value: entity,
    error,
    loading,
    retry: refresh,
  } = useAsyncRetry(
    () => catalogApi.getEntityByRef({ kind, namespace, name }),
    [catalogApi, kind, namespace, name],
  );

  useEffect(() => {
    if (!name) {
      errorApi.post(new Error('No name provided!'));
      navigate('/');
    }
  }, [errorApi, navigate, error, loading, entity, name]);

  return { entity, loading, error, refresh };
};

export const titleExtensionDataRef = createExtensionDataRef<string>(
  'plugin.catalog.entity.content.title',
);

const CatalogEntityPage = createPageExtension({
  id: 'plugin.catalog.page.entity',
  defaultPath: '/catalog/:namespace/:kind/:name',
  routeRef: convertLegacyRouteRef(entityRouteRef),
  inputs: {
    contents: createExtensionInput({
      element: coreExtensionData.reactElement,
      path: coreExtensionData.routePath,
      routeRef: coreExtensionData.routeRef.optional(),
      title: titleExtensionDataRef,
    }),
  },
  loader: async ({ inputs }) => {
    const Component = () => {
      return (
        <AsyncEntityProvider {...useEntityFromUrl()}>
          <EntityLayout>
            {inputs.contents.map(content => (
              <EntityLayout.Route
                key={content.path}
                path={content.path}
                title={content.title}
              >
                {content.element}
              </EntityLayout.Route>
            ))}
          </EntityLayout>
        </AsyncEntityProvider>
      );
    };
    return <Component />;
  },
});

export function createEntityCardExtension<
  TConfig,
  TInputs extends AnyExtensionInputMap,
>(options: {
  id: string;
  attachTo?: { id: string; input: string };
  disabled?: boolean;
  inputs?: TInputs;
  configSchema?: PortableSchema<TConfig>;
  loader: (options: {
    config: TConfig;
    inputs: Expand<ExtensionInputValues<TInputs>>;
  }) => Promise<JSX.Element>;
}): Extension<TConfig> {
  return createExtension({
    id: `entity.content.${options.id}`,
    attachTo: options.attachTo ?? {
      id: 'entity.content.overview',
      input: 'cards',
    },
    disabled: options.disabled ?? true,
    output: {
      element: coreExtensionData.reactElement,
    },
    inputs: options.inputs,
    configSchema: options.configSchema,
    factory({ bind, config, inputs, source }) {
      const LazyComponent = React.lazy(() =>
        options
          .loader({ config, inputs })
          .then(element => ({ default: () => element })),
      );

      bind({
        element: (
          <ExtensionBoundary source={source}>
            <React.Suspense fallback="...">
              <LazyComponent />
            </React.Suspense>
          </ExtensionBoundary>
        ),
      });
    },
  });
}

export function createEntityContentExtension<
  TConfig extends { path: string; title: string },
  TInputs extends AnyExtensionInputMap,
>(
  options: (
    | {
        defaultPath: string;
        defaultTitle: string;
      }
    | {
        configSchema: PortableSchema<TConfig>;
      }
  ) & {
    id: string;
    attachTo?: { id: string; input: string };
    disabled?: boolean;
    inputs?: TInputs;
    routeRef?: RouteRef;
    loader: (options: {
      config: TConfig;
      inputs: Expand<ExtensionInputValues<TInputs>>;
    }) => Promise<JSX.Element>;
  },
): Extension<TConfig> {
  const configSchema =
    'configSchema' in options
      ? options.configSchema
      : (createSchemaFromZod(z =>
          z.object({
            path: z.string().default(options.defaultPath),
            title: z.string().default(options.defaultTitle),
          }),
        ) as PortableSchema<TConfig>);

  return createExtension({
    id: `entity.content.${options.id}`,
    attachTo: options.attachTo ?? {
      id: 'plugin.catalog.page.entity',
      input: 'contents',
    },
    disabled: options.disabled ?? true,
    output: {
      element: coreExtensionData.reactElement,
      path: coreExtensionData.routePath,
      routeRef: coreExtensionData.routeRef.optional(),
      title: titleExtensionDataRef,
    },
    inputs: options.inputs,
    configSchema,
    factory({ bind, config, inputs, source }) {
      const LazyComponent = React.lazy(() =>
        options
          .loader({ config, inputs })
          .then(element => ({ default: () => element })),
      );

      bind({
        path: config.path,
        element: (
          <ExtensionBoundary source={source}>
            <React.Suspense fallback="...">
              <LazyComponent />
            </React.Suspense>
          </ExtensionBoundary>
        ),
        routeRef: options.routeRef,
        title: config.title,
      });
    },
  });
}

const entityAboutCardExtension = createEntityCardExtension({
  id: 'about',
  disabled: false,
  loader: async () => <EntityAboutCard variant="gridItem" />,
  // entityFilter: isDerp,
});

const overviewContentExtension = createEntityContentExtension({
  id: 'overview',
  defaultPath: '/',
  defaultTitle: 'Overview',
  disabled: false,
  inputs: {
    cards: createExtensionInput({
      element: coreExtensionData.reactElement,
    }),
  },
  loader: async ({ inputs }) => (
    <Grid container spacing={3} alignItems="stretch">
      {inputs.cards.map(card => (
        <Grid item md={6} xs={12}>
          {card.element}
        </Grid>
      ))}
    </Grid>
  ),
});

const bonusTechdocsPlugin = createPlugin({
  id: 'techdocs-entity',
  extensions: [
    createEntityContentExtension({
      id: 'techdocs',
      defaultPath: 'docs',
      defaultTitle: 'TechDocs',
      disabled: false,
      loader: () =>
        import('@backstage/plugin-techdocs').then(m => (
          <m.EmbeddedDocsRouter />
        )),
      // entityFilter: isPullRequestsAvailable,
    }),
  ],
});

export const entityPagePlugins = [
  createPlugin({
    id: 'entity-pages',
    extensions: [
      CatalogEntityPage,
      overviewContentExtension,
      entityAboutCardExtension,
    ],
  }),
  bonusTechdocsPlugin,
  // deploymentsPlugin,
];
