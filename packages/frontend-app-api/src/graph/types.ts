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
  BackstagePlugin,
  Extension,
  ExtensionDataRef,
} from '@backstage/frontend-plugin-api';

/*
NOTE: These types are marked as @internal for now, but the intention is for this to be a public API in the future.
*/

/**
 * The specification for this node in the app graph.
 *
 * @internal
 * @remarks
 *
 * The specifications for a collection of app nodes is all the information needed
 * to build the graph and instantiate the nodes.
 */
export interface AppNodeSpec {
  readonly id: string;
  readonly attachTo: { id: string; input: string };
  readonly extension: Extension<unknown>;
  readonly disabled: boolean;
  readonly config?: unknown;
  readonly source?: BackstagePlugin;
}

/**
 * The connections from this node to other nodes.
 *
 * @internal
 * @remarks
 *
 * The app node edges are resolved based on the app node specs, regardless of whether
 * adjacent nodes are disabled or not. If no parent attachment is present or
 */
export interface AppNodeEdges {
  readonly attachedTo?: { node: AppNode; input: string };
  readonly attachments: ReadonlyMap<string, AppNode[]>;
}

/**
 * The instance of this node in the app graph.
 *
 * @internal
 * @remarks
 *
 * The app node instance is created when the `factory` function of an extension is called.
 * Instances will only be present for nodes in the app that are connected to the root
 * node and not disabled
 */
export interface AppNodeInstance {
  /** Returns a sequence of all extension data refs that were output by this instance */
  getDataRefs(): Iterable<ExtensionDataRef<unknown>>;
  /** Get the output data for a single extension data ref */
  getData<T>(ref: ExtensionDataRef<T>): T | undefined;
}

/**
 *
 * @internal
 */
export interface AppNode {
  /** The specification for how this node should be instantiated */
  readonly spec: AppNodeSpec;
  /** The edges from this node to other nodes in the app graph */
  readonly edges: AppNodeEdges;
  /** The instance of this node, if it was instantiated */
  readonly instance?: AppNodeInstance;
}

/**
 * The app graph containing all nodes of the app.
 *
 * @internal
 */
export interface AppGraph {
  /** The root node of the app */
  root: AppNode;
  /** A map of all nodes in the app by ID, including orphaned or disabled nodes */
  nodes: ReadonlyMap<string /* id */, AppNode>;
  /** A sequence of all nodes with a parent that is not reachable from the app root node */
  orphans: Iterable<AppNode>;
}
