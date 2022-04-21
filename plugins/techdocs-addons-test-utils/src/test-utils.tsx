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

// import order matters for jest manual mocks! import this first.
import { useTechDocsReaderDom, useParams } from './mocks';

import React, { ReactElement, Fragment } from 'react';

// Shadow DOM support for the simple and complete DOM testing utilities
// https://github.com/testing-library/dom-testing-library/issues/742#issuecomment-674987855
import { screen } from 'testing-library__dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { Route, Routes } from 'react-router-dom';
import { act, render } from '@testing-library/react';

import {
  wrapInTestApp,
  TestApiProvider,
  TestApiProviderProps,
} from '@backstage/test-utils';

import {
  TechDocsEntityMetadata,
  TechDocsMetadata,
  TechDocsAddons,
} from '@backstage/plugin-techdocs-react';
import { TechDocsReaderPage } from '@backstage/plugin-techdocs';

/**
 * Allow only passing single values in nested objects to mock metadata
 * @alpha
 */
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

/**
 * Custom API ref and implementation to be passed to the TechDocs addons environment
 * @alpha
 */
export type Apis = TestApiProviderProps<any>['apis'];

/**
 * Provided values to mock a TechDocs addons environment
 * @alpha
 */
export type TechDocsAddonBuilderOptions = {
  dom: ReactElement;
  entity: RecursivePartial<TechDocsEntityMetadata>;
  metadata: RecursivePartial<TechDocsMetadata>;
  componentId: string;
  apis: Apis;
  path: string;
};

const defaultOptions: TechDocsAddonBuilderOptions = {
  dom: <></>,
  entity: {},
  metadata: {},
  componentId: 'docs',
  apis: [],
  path: '',
};

const defaultEntity = {
  kind: 'Component',
  metadata: { namespace: 'default', name: 'docs' },
};

const defaultDom = (
  <html lang="en">
    <head />
    <body>
      <div data-md-component="content">
        <div data-md-component="navigation" />
        <div data-md-component="toc" />
        <div data-md-component="sidebar" />
        <div data-md-component="main" />
      </div>
    </body>
  </html>
);

/**
 * Test utility to insert addons into a testable TechDocs environment
 * @alpha
 */
export class TechDocsAddonBuilder {
  private options: TechDocsAddonBuilderOptions = defaultOptions;
  private addons: ReactElement[];

  static buildAddonsInTechDocs(addons: ReactElement[]) {
    return new TechDocsAddonBuilder(addons);
  }

  constructor(addons: ReactElement[]) {
    this.addons = addons;
  }

  withApis(apis: Apis) {
    const refs = apis.map(([ref]) => ref);
    this.options.apis = this.options.apis
      .filter(([ref]) => !refs.includes(ref))
      .concat(apis);
    return this;
  }

  withDom(dom: ReactElement) {
    this.options.dom = dom;
    return this;
  }

  withMetadata(metadata: RecursivePartial<TechDocsMetadata>) {
    this.options.metadata = metadata;
    return this;
  }

  withEntity(entity: RecursivePartial<TechDocsEntityMetadata>) {
    this.options.entity = entity;
    return this;
  }

  atPath(path: string) {
    this.options.path = path;
    return this;
  }

  build() {
    const apis = [...this.options.apis];
    const entityName = {
      namespace:
        this.options.entity?.metadata?.namespace ||
        defaultEntity.metadata.namespace,
      kind: this.options.entity?.kind || defaultEntity.kind,
      name: this.options.entity?.metadata?.name || defaultEntity.metadata.name,
    };

    const dom = document.createElement('html');
    dom.innerHTML = renderToStaticMarkup(this.options.dom || defaultDom);
    useTechDocsReaderDom.mockReturnValue(dom);
    // todo(backstage/techdocs-core): Use core test-utils' `routeEntries` option to mock
    // the current path. We use jest mocks instead for now because of a bug in
    // react-router that prevents '*' params from being mocked.
    useParams.mockReturnValue({
      ...entityName,
      '*': this.options.path,
    });

    return wrapInTestApp(
      <TestApiProvider apis={apis}>
        <Routes>
          <Route
            path="*"
            element={
              <TechDocsReaderPage withSearch={false} withHeader={false} />
            }
          >
            <TechDocsAddons>
              {this.addons.map((addon, index) => (
                <Fragment key={index}>{addon}</Fragment>
              ))}
            </TechDocsAddons>
          </Route>
        </Routes>
      </TestApiProvider>,
    );
  }

  render(): typeof screen & { shadowRoot: ShadowRoot | null } {
    render(this.build());

    const shadowHost = screen.getByTestId('techdocs-native-shadowroot');

    return {
      ...screen,
      shadowRoot: shadowHost?.shadowRoot,
    };
  }

  // Components using useEffect to perform an asynchronous action (such as fetch) must be rendered within an async
  // act call to properly get the final state, even with mocked responses. This utility method makes the signature a bit
  // cleaner, since act doesn't return the result of the evaluated function.
  // https://github.com/testing-library/react-testing-library/issues/281
  // https://github.com/facebook/react/pull/14853
  async renderWithEffects(): Promise<
    ReturnType<TechDocsAddonBuilder['render']>
  > {
    await act(async () => {
      this.render();
    });

    const shadowHost = screen.getByTestId('techdocs-native-shadowroot');

    return {
      ...screen,
      shadowRoot: shadowHost?.shadowRoot,
    };
  }
}

export default TechDocsAddonBuilder.buildAddonsInTechDocs;
