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

import React from 'react';
import { MemoryRouter, Link } from 'react-router-dom';
import { RenderResult, render } from '@testing-library/react';
import { createSpecializedApp } from '@backstage/frontend-app-api';
import {
  AppNode,
  AppTree,
  Extension,
  ExtensionDataRef,
  ExtensionDefinition,
  IconComponent,
  RouteRef,
  coreExtensionData,
  createExtension,
  createExtensionInput,
  createExtensionOverrides,
  createNavItemExtension,
  createRouterExtension,
  useRouteRef,
} from '@backstage/frontend-plugin-api';
import { Config, ConfigReader } from '@backstage/config';
import { JsonArray, JsonObject, JsonValue } from '@backstage/types';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { resolveExtensionDefinition } from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalExtensionDefinition } from '../../../frontend-plugin-api/src/wiring/createExtension';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { resolveAppTree } from '../../../frontend-app-api/src/tree/resolveAppTree';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { resolveAppNodeSpecs } from '../../../frontend-app-api/src/tree/resolveAppNodeSpecs';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { instantiateAppNodeTree } from '../../../frontend-app-api/src/tree/instantiateAppNodeTree';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { readAppExtensionsConfig } from '../../../frontend-app-api/src/tree/readAppExtensionsConfig';

/** @public */
export class ExtensionQuery {
  #node: AppNode;

  constructor(node: AppNode) {
    this.#node = node;
  }

  get node() {
    return this.#node;
  }

  get instance() {
    const instance = this.#node.instance;
    if (!instance) {
      throw new Error(
        `Unable to access the instance of extension with ID '${
          this.#node.spec.id
        }'`,
      );
    }
    return instance;
  }

  data<T>(ref: ExtensionDataRef<T>): T | undefined {
    return this.instance.getData(ref);
  }
}

/** @public */
export class ExtensionTester {
  /** @internal */
  static forSubject<TConfig, TConfigInput>(
    subject: ExtensionDefinition<TConfig, TConfigInput>,
    options?: { config?: TConfigInput },
  ): ExtensionTester {
    const tester = new ExtensionTester();
    const internal = toInternalExtensionDefinition(subject);

    // attaching to app/routes to render as index route
    if (internal.version === 'v1') {
      tester.add(
        createExtension({
          ...internal,
          attachTo: { id: 'app/routes', input: 'routes' },
          output: {
            ...internal.output,
            path: coreExtensionData.routePath,
          },
          factory: params => ({
            ...internal.factory(params as any),
            path: '/',
          }),
        }),
        options as TConfigInput & {},
      );
    } else if (internal.version === 'v2') {
      tester.add(
        createExtension({
          ...internal,
          attachTo: { id: 'app/routes', input: 'routes' },
          output: internal.output.find(
            ref => ref.id === coreExtensionData.routePath.id,
          )
            ? internal.output
            : [...internal.output, coreExtensionData.routePath],
          factory: params => {
            const parentOutput = Array.from(
              internal.factory(params as any),
            ).filter(val => val.id !== coreExtensionData.routePath.id);

            return [...parentOutput, coreExtensionData.routePath('/')];
          },
        }),
        options as TConfigInput & {},
      );
    }
    return tester;
  }

  #tree?: AppTree;

  readonly #extensions = new Array<{
    id: string;
    extension: Extension<any>;
    definition: ExtensionDefinition<any>;
    config?: JsonValue;
  }>();

  add<TConfig, TConfigInput>(
    extension: ExtensionDefinition<TConfig, TConfigInput>,
    options?: { config?: TConfigInput },
  ): ExtensionTester {
    if (this.#tree) {
      throw new Error(
        'Cannot add more extensions accessing the extension tree',
      );
    }

    const { name, namespace } = extension;

    const definition = {
      ...extension,
      // setting name "test" as fallback
      name: !namespace && !name ? 'test' : name,
    };

    const resolvedExtension = resolveExtensionDefinition(definition);

    this.#extensions.push({
      id: resolvedExtension.id,
      extension: resolvedExtension,
      definition,
      config: options?.config as JsonValue,
    });

    return this;
  }

  data<T>(ref: ExtensionDataRef<T>): T | undefined {
    const tree = this.#resolveTree();

    return new ExtensionQuery(tree.root).data(ref);
  }

  query(id: string | ExtensionDefinition<any, any>): ExtensionQuery {
    const tree = this.#resolveTree();

    const actualId =
      typeof id === 'string' ? id : resolveExtensionDefinition(id).id;

    const node = tree.nodes.get(actualId);

    if (!node) {
      throw new Error(
        `Extension with ID '${actualId}' not found, please make sure it's added to the tester.`,
      );
    } else if (!node.instance) {
      throw new Error(
        `Extension with ID '${actualId}' has not been instantiated, because it is not part of the test subject's extension tree.`,
      );
    }
    return new ExtensionQuery(node);
  }

  element(): JSX.Element {
    const tree = this.#resolveTree();

    const element = new ExtensionQuery(tree.root).data(
      coreExtensionData.reactElement,
    );

    if (!element) {
      throw new Error(
        'No element found. Make sure the extension has a `coreExtensionData.reactElement` output, or use the `.get(myComponentDataRef)` method to get the component',
      );
    }

    return element;
  }

  /**
   * @deprecated Switch to using `renderInTestApp` directly and using `.element()` or `.get(myComponentDataRef)` to get the component you would like to wrap up
   */
  render(options?: { config?: JsonObject }): RenderResult {
    const { config = {} } = options ?? {};

    const [subject] = this.#extensions;
    if (!subject) {
      throw new Error(
        'No subject found. At least one extension should be added to the tester.',
      );
    }

    const app = createSpecializedApp({
      features: [
        createExtensionOverrides({
          extensions: [
            ...this.#extensions.map(extension => extension.definition),
            createRouterExtension({
              namespace: 'test',
              Component: ({ children }) => (
                <MemoryRouter>{children}</MemoryRouter>
              ),
            }),
          ],
        }),
      ],
      config: this.#getConfig(config),
    });

    return render(app.createRoot());
  }

  #resolveTree() {
    if (this.#tree) {
      return this.#tree;
    }

    const [subject] = this.#extensions;
    if (!subject) {
      throw new Error(
        'No subject found. At least one extension should be added to the tester.',
      );
    }

    const tree = resolveAppTree(
      subject.id,
      resolveAppNodeSpecs({
        features: [],
        builtinExtensions: this.#extensions.map(_ => _.extension),
        parameters: readAppExtensionsConfig(this.#getConfig()),
      }),
    );

    instantiateAppNodeTree(tree.root);

    this.#tree = tree;

    return tree;
  }

  #getConfig(additionalConfig?: JsonObject): Config {
    const [subject, ...rest] = this.#extensions;

    const extensionsConfig: JsonArray = [
      ...rest.map(extension => ({
        [extension.id]: {
          config: extension.config,
        },
      })),
      {
        [subject.id]: {
          config: subject.config,
          disabled: false,
        },
      },
    ];

    return ConfigReader.fromConfigs([
      { context: 'render-config', data: additionalConfig ?? {} },
      {
        context: 'test',
        data: {
          app: {
            extensions: extensionsConfig,
          },
        },
      },
    ]);
  }
}

/** @public */
export function createExtensionTester<TConfig>(
  subject: ExtensionDefinition<TConfig>,
  options?: { config?: TConfig },
): ExtensionTester {
  return ExtensionTester.forSubject(subject, options);
}
