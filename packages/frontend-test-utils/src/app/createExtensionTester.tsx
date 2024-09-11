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
  AnyExtensionDataRef,
  AppNode,
  AppTree,
  Extension,
  ExtensionDataRef,
  ExtensionDefinition,
  ExtensionDefinitionParameters,
  coreExtensionData,
} from '@backstage/frontend-plugin-api';
import { Config, ConfigReader } from '@backstage/config';
import { JsonArray, JsonObject, JsonValue } from '@backstage/types';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { resolveExtensionDefinition } from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { resolveAppTree } from '../../../frontend-app-api/src/tree/resolveAppTree';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { resolveAppNodeSpecs } from '../../../frontend-app-api/src/tree/resolveAppNodeSpecs';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { instantiateAppNodeTree } from '../../../frontend-app-api/src/tree/instantiateAppNodeTree';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { readAppExtensionsConfig } from '../../../frontend-app-api/src/tree/readAppExtensionsConfig';
import { TestApiRegistry } from '@backstage/test-utils';
import { OpaqueExtensionDefinition } from '@internal/frontend';

/** @public */
export class ExtensionQuery<UOutput extends AnyExtensionDataRef> {
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

  get<TId extends UOutput['id']>(
    ref: ExtensionDataRef<any, TId, any>,
  ): UOutput extends ExtensionDataRef<infer IData, TId, infer IConfig>
    ? IConfig['optional'] extends true
      ? IData | undefined
      : IData
    : never {
    return this.instance.getData(ref);
  }
}

/** @public */
export class ExtensionTester<UOutput extends AnyExtensionDataRef> {
  /** @internal */
  static forSubject<T extends ExtensionDefinitionParameters>(
    subject: ExtensionDefinition<T>,
    options?: { config?: T['configInput'] },
  ): ExtensionTester<NonNullable<T['output']>> {
    const tester = new ExtensionTester();
    tester.add(subject, options as T['configInput'] & {});
    return tester;
  }

  #tree?: AppTree;

  readonly #extensions = new Array<{
    id: string;
    extension: Extension<any>;
    definition: ExtensionDefinition;
    config?: JsonValue;
  }>();

  add<T extends ExtensionDefinitionParameters>(
    extension: ExtensionDefinition<T>,
    options?: { config?: T['configInput'] },
  ): ExtensionTester<UOutput> {
    if (this.#tree) {
      throw new Error(
        'Cannot add more extensions accessing the extension tree',
      );
    }

    const { name, namespace } = OpaqueExtensionDefinition.toInternal(extension);

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

  get<TId extends UOutput['id']>(
    ref: ExtensionDataRef<any, TId, any>,
  ): UOutput extends ExtensionDataRef<infer IData, TId, infer IConfig>
    ? IConfig['optional'] extends true
      ? IData | undefined
      : IData
    : never {
    const tree = this.#resolveTree();

    return new ExtensionQuery(tree.root).get(ref);
  }

  query<T extends ExtensionDefinitionParameters>(
    extension: ExtensionDefinition<T>,
  ): ExtensionQuery<NonNullable<T['output']>> {
    const tree = this.#resolveTree();

    // Same fallback logic as in .add
    const { name, namespace } = OpaqueExtensionDefinition.toInternal(extension);
    const definition = {
      ...extension,
      name: !namespace && !name ? 'test' : name,
    };
    const actualId = resolveExtensionDefinition(definition).id;

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

  reactElement(): JSX.Element {
    const tree = this.#resolveTree();

    const element = new ExtensionQuery(tree.root).get(
      coreExtensionData.reactElement,
    );

    if (!element) {
      throw new Error(
        'No element found. Make sure the extension has a `coreExtensionData.reactElement` output, or use the `.get(...)` to access output data directly instead',
      );
    }

    return element;
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

    instantiateAppNodeTree(tree.root, TestApiRegistry.from());

    this.#tree = tree;

    return tree;
  }

  #getConfig(additionalConfig?: JsonObject): Config {
    const [subject, ...rest] = this.#extensions;

    const extensionsConfig: JsonArray = [
      ...rest.flatMap(extension =>
        extension.config
          ? [
              {
                [extension.id]: {
                  config: extension.config,
                },
              },
            ]
          : [],
      ),
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
export function createExtensionTester<T extends ExtensionDefinitionParameters>(
  subject: ExtensionDefinition<T>,
  options?: { config?: T['configInput'] },
): ExtensionTester<NonNullable<T['output']>> {
  return ExtensionTester.forSubject(subject, options);
}
