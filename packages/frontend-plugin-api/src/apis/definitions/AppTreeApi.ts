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

import { createApiRef } from '@backstage/core-plugin-api';
import {
  FrontendPlugin,
  Extension,
  ExtensionDataRef,
  ExtensionAttachToSpec,
} from '../../wiring';

/**
 * The specification for this {@link AppNode} in the {@link AppTree}.
 *
 * @public
 * @remarks
 *
 * The specifications for a collection of app nodes is all the information needed
 * to build the tree and instantiate the nodes.
 */
export interface AppNodeSpec {
  readonly id: string;
  readonly attachTo: ExtensionAttachToSpec;
  readonly extension: Extension<unknown, unknown>;
  readonly disabled: boolean;
  readonly config?: unknown;
  readonly source?: FrontendPlugin;
}

/**
 * The connections from this {@link AppNode} to other nodes.
 *
 * @public
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
 * The instance of this {@link AppNode} in the {@link AppTree}.
 *
 * @public
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
 * A node in the {@link AppTree}.
 *
 * @public
 */
export interface AppNode {
  /** The specification for how this node should be instantiated */
  readonly spec: AppNodeSpec;
  /** The edges from this node to other nodes in the app tree */
  readonly edges: AppNodeEdges;
  /** The instance of this node, if it was instantiated */
  readonly instance?: AppNodeInstance;
}

/**
 * The app tree containing all {@link AppNode}s of the app.
 *
 * @public
 */
export interface AppTree {
  /** The root node of the app */
  readonly root: AppNode;
  /** A map of all nodes in the app by ID, including orphaned or disabled nodes */
  readonly nodes: ReadonlyMap<string /* id */, AppNode>;
  /** A sequence of all nodes with a parent that is not reachable from the app root node */
  readonly orphans: Iterable<AppNode>;
}

/**
 * The API for interacting with the {@link AppTree}.
 *
 * @public
 */
export interface AppTreeApi {
  /**
   * Get the {@link AppTree} for the app.
   */
  getTree(): { tree: AppTree };

  /**
   * Get all nodes in the app that are mounted at a given route path.
   */
  getNodesByRoutePath(sourcePath: string): { nodes: AppNode[] };
}

/**
 * The `ApiRef` of {@link AppTreeApi}.
 *
 * @public
 */
export const appTreeApiRef = createApiRef<AppTreeApi>({ id: 'core.app-tree' });
