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
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { createErrorCollector } from '../../../frontend-app-api/src/wiring/createErrorCollector';
import { OpaqueExtensionDefinition } from '@internal/frontend';
import { TestApiRegistry, type TestApiPairs } from '../utils';

/**
 * Represents a snapshot of an extension in the app tree.
 *
 * @public
 */
export interface ExtensionSnapshotNode {
  /** The ID of the extension */
  id: string;
  /** The IDs of output data refs produced by this extension */
  outputs?: string[];
  /** Child extensions organized by input name */
  children?: Record<string, ExtensionSnapshotNode[]>;
  /** Whether this extension is disabled */
  disabled?: true;
}

/** @public */
export class ExtensionQuery<UOutput extends ExtensionDataRef> {
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
export class ExtensionTester<UOutput extends ExtensionDataRef> {
  /** @internal */
  static forSubject<
    T extends ExtensionDefinitionParameters,
    TApiPairs extends any[],
  >(
    subject: ExtensionDefinition<T>,
    options?: {
      config?: T['configInput'];
      apis?: readonly [...TestApiPairs<TApiPairs>];
    },
  ): ExtensionTester<NonNullable<T['output']>> {
    const tester = new ExtensionTester(options?.apis);
    tester.add(subject, options as T['configInput'] & {});
    return tester;
  }

  #tree?: AppTree;
  #apis?: readonly any[];

  readonly #extensions = new Array<{
    id: string;
    extension: Extension<any>;
    definition: ExtensionDefinition;
    config?: JsonValue;
  }>();

  private constructor(apis?: readonly any[]) {
    this.#apis = apis;
  }

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

  /**
   * Returns a snapshot of the extension tree structure for testing and debugging.
   * Convenient to use with Jest's inline snapshot testing.
   *
   * @example
   * ```tsx
   * const tester = createExtensionTester(myExtension);
   * expect(tester.snapshot()).toMatchInlineSnapshot();
   * ```
   */
  snapshot(): ExtensionSnapshotNode {
    const tree = this.#resolveTree();

    const buildNode = (node: AppNode): ExtensionSnapshotNode => {
      const outputs = node.instance
        ? Array.from(node.instance.getDataRefs())
            .map(ref => ref.id)
            .sort()
        : [];

      const children: Record<string, ExtensionSnapshotNode[]> = {};
      for (const [inputName, attachedNodes] of node.edges.attachments) {
        children[inputName] = attachedNodes
          .map(n => buildNode(n))
          .sort((a, b) => a.id.localeCompare(b.id));
      }

      const result: ExtensionSnapshotNode = {
        id: node.spec.id,
      };

      // Only include non-empty/non-default fields
      if (outputs.length > 0) {
        result.outputs = outputs;
      }
      if (Object.keys(children).length > 0) {
        result.children = children;
      }
      if (node.spec.disabled) {
        result.disabled = true;
      }

      return result;
    };

    return buildNode(tree.root);
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

    const collector = createErrorCollector();

    const tree = resolveAppTree(
      subject.id,
      resolveAppNodeSpecs({
        features: [],
        builtinExtensions: this.#extensions.map(_ => _.extension),
        parameters: readAppExtensionsConfig(this.#getConfig()),
        collector,
      }),
      collector,
    );

    const apiHolder = this.#apis
      ? TestApiRegistry.from(...this.#apis)
      : TestApiRegistry.from();

    instantiateAppNodeTree(tree.root, apiHolder, collector);

    const errors = collector.collectErrors();
    if (errors) {
      throw new Error(
        `Failed to resolve the extension tree: ${errors
          .map(e => e.message)
          .join(', ')}`,
      );
    }

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
export function createExtensionTester<
  T extends ExtensionDefinitionParameters,
  TApiPairs extends any[] = any[],
>(
  subject: ExtensionDefinition<T>,
  options?: {
    config?: T['configInput'];
    apis?: readonly [...TestApiPairs<TApiPairs>];
  },
): ExtensionTester<NonNullable<T['output']>> {
  return ExtensionTester.forSubject(subject, options);
}
