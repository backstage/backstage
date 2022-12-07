/*
 * Copyright 2022 The Backstage Authors
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

import React, { ReactElement, Fragment } from 'react';

// Shadow DOM support for the simple and complete DOM testing utilities
// https://github.com/testing-library/dom-testing-library/issues/742#issuecomment-674987855
import { screen } from 'testing-library__dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { Route } from 'react-router-dom';
import { act, render } from '@testing-library/react';

import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';
import { FlatRoutes } from '@backstage/core-app-api';
import { ApiRef } from '@backstage/core-plugin-api';

import {
  TechDocsAddons,
  techdocsApiRef,
  TechDocsEntityMetadata,
  TechDocsMetadata,
  techdocsStorageApiRef,
} from '@backstage/plugin-techdocs-react';
import { TechDocsReaderPage, techdocsPlugin } from '@backstage/plugin-techdocs';
import { catalogPlugin } from '@backstage/plugin-catalog';
import { searchApiRef } from '@backstage/plugin-search-react';
import { scmIntegrationsApiRef } from '@backstage/integration-react';

const techdocsApi = {
  getTechDocsMetadata: jest.fn(),
  getEntityMetadata: jest.fn(),
};

const techdocsStorageApi = {
  getApiOrigin: jest.fn(),
  getBaseUrl: jest.fn(),
  getEntityDocs: jest.fn(),
  syncEntityDocs: jest.fn(),
};

const searchApi = {
  query: jest.fn().mockResolvedValue({ results: [] }),
};

const scmIntegrationsApi = {
  fromConfig: jest.fn().mockReturnValue({}),
};

/** @ignore */
type TechDocsAddonTesterTestApiPair<TApi> = TApi extends infer TImpl
  ? readonly [ApiRef<TApi>, Partial<TImpl>]
  : never;

/** @ignore */
type TechdocsAddonTesterApis<TApiPairs> = {
  [TIndex in keyof TApiPairs]: TechDocsAddonTesterTestApiPair<
    TApiPairs[TIndex]
  >;
};

type TechDocsAddonTesterOptions = {
  dom: ReactElement;
  entity: Partial<TechDocsEntityMetadata>;
  metadata: Partial<TechDocsMetadata>;
  componentId: string;
  apis: TechdocsAddonTesterApis<any[]>;
  path: string;
};

const defaultOptions: TechDocsAddonTesterOptions = {
  dom: <></>,
  entity: { metadata: { name: '' } },
  metadata: {},
  componentId: 'docs',
  apis: [],
  path: '',
};

const defaultMetadata = {
  site_name: 'Tech Docs',
  site_description: 'Tech Docs',
};

const defaultEntity = {
  kind: 'Component',
  metadata: { namespace: 'default', name: 'docs' },
};

const defaultDom = (
  <html lang="en">
    <head />
    <body>
      <div data-md-component="container">
        <div data-md-component="navigation" />
        <div data-md-component="toc" />
        <div data-md-component="main" />
      </div>
    </body>
  </html>
);

/**
 * Utility class for rendering TechDocs Addons end-to-end within the TechDocs
 * reader page, with a set of givens (e.g. page DOM, metadata, etc).
 *
 * @example
 * ```tsx
 * const { getByText } = await TechDocsAddonTester.buildAddonsInTechDocs([<AnAddon />])
 *   .withDom(<body>TEST_CONTENT</body>)
 *   .renderWithEffects();
 *
 * expect(getByText('TEST_CONTENT')).toBeInTheDocument();
 * ```
 *
 * @public
 */
export class TechDocsAddonTester {
  private options: TechDocsAddonTesterOptions = defaultOptions;
  private addons: ReactElement[];

  /**
   * Get a TechDocsAddonTester instance for a given set of Addons.
   */
  static buildAddonsInTechDocs(addons: ReactElement[]) {
    return new TechDocsAddonTester(addons);
  }

  // Protected in order to allow extension but not direct instantiation.
  protected constructor(addons: ReactElement[]) {
    this.addons = addons;
  }

  /**
   * Provide mock API implementations if your Addon expects any.
   */
  withApis<T extends any[]>(apis: TechdocsAddonTesterApis<T>) {
    const refs = apis.map(([ref]) => ref);
    this.options.apis = this.options.apis
      .filter(([ref]) => !refs.includes(ref))
      .concat(apis);
    return this;
  }

  /**
   * Provide mock HTML if your Addon expects it in the shadow DOM.
   */
  withDom(dom: ReactElement) {
    this.options.dom = dom;
    return this;
  }

  /**
   * Provide mock techdocs_metadata.json values if your Addon needs it.
   */
  withMetadata(metadata: Partial<TechDocsMetadata>) {
    this.options.metadata = metadata;
    return this;
  }

  /**
   * Provide a mock entity if your Addon needs it. This also controls the base
   * path at which the Addon is rendered.
   */
  withEntity(entity: Partial<TechDocsEntityMetadata>) {
    this.options.entity = entity;
    return this;
  }

  /**
   * Provide the TechDocs page path at which the Addon is rendered (e.g. the
   * part of the path after the entity namespace/kind/name).
   */
  atPath(path: string) {
    this.options.path = path;
    return this;
  }

  /**
   * Return a fully configured and mocked TechDocs reader page within a test
   * App instance, using the given Addon(s).
   */
  build() {
    const apis: TechdocsAddonTesterApis<any[]> = [
      [techdocsApiRef, techdocsApi],
      [techdocsStorageApiRef, techdocsStorageApi],
      [searchApiRef, searchApi],
      [scmIntegrationsApiRef, scmIntegrationsApi],
      ...this.options.apis,
    ];

    const entityName = {
      namespace:
        this.options.entity?.metadata?.namespace ||
        defaultEntity.metadata.namespace,
      kind: this.options.entity?.kind || defaultEntity.kind,
      name: this.options.entity?.metadata?.name || defaultEntity.metadata.name,
    };

    techdocsApi.getTechDocsMetadata.mockReturnValue(
      this.options.metadata || { ...defaultMetadata },
    );
    techdocsApi.getEntityMetadata.mockResolvedValue(
      this.options.entity || { ...defaultEntity },
    );

    techdocsStorageApi.syncEntityDocs.mockResolvedValue('cached');
    techdocsStorageApi.getApiOrigin.mockResolvedValue(
      'https://backstage.example.com/api/techdocs',
    );
    techdocsStorageApi.getBaseUrl.mockResolvedValue(
      `https://backstage.example.com/api/techdocs/${entityName.namespace}/${entityName.kind}/${entityName.name}/${this.options.path}`,
    );
    techdocsStorageApi.getEntityDocs.mockResolvedValue(
      renderToStaticMarkup(this.options.dom || defaultDom),
    );

    const TechDocsAddonsPage = () => {
      return (
        <TestApiProvider apis={apis}>
          <FlatRoutes>
            <Route
              path="/docs/:namespace/:kind/:name/*"
              element={<TechDocsReaderPage />}
            >
              <TechDocsAddons>
                {this.addons.map((addon, index) => (
                  <Fragment key={index}>{addon}</Fragment>
                ))}
              </TechDocsAddons>
            </Route>
          </FlatRoutes>
        </TestApiProvider>
      );
    };

    return wrapInTestApp(<TechDocsAddonsPage />, {
      routeEntries: [
        `/docs/${entityName.namespace}/${entityName.kind}/${entityName.name}/${this.options.path}`,
      ],
      mountedRoutes: {
        '/docs': techdocsPlugin.routes.root,
        '/docs/:namespace/:kind/:name/*': techdocsPlugin.routes.docRoot,
        '/catalog/:namespace/:kind/:name': catalogPlugin.routes.catalogEntity,
      },
    });
  }

  /**
   * Render the Addon within a fully configured and mocked TechDocs reader.
   *
   * @remarks
   * Components using useEffect to perform an asynchronous action (such as
   * fetch) must be rendered within an async act call to properly get the final
   * state, even with mocked responses. This utility method makes the signature
   * a bit cleaner, since act doesn't return the result of the evaluated
   * function.
   *
   * @see https://github.com/testing-library/react-testing-library/issues/281
   * @see https://github.com/facebook/react/pull/14853
   */
  async renderWithEffects(): Promise<
    typeof screen & { shadowRoot: ShadowRoot | null }
  > {
    await act(async () => {
      render(this.build());
    });

    const shadowHost = screen.getByTestId('techdocs-native-shadowroot');

    return {
      ...screen,
      shadowRoot: shadowHost?.shadowRoot || null,
    };
  }
}

export default TechDocsAddonTester.buildAddonsInTechDocs;
