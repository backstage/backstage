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

/**
 * The specification for this node in the app graph.
 * @public
 */
export interface AppNodeSpec {
  readonly id: string;
  readonly attachTo?: { id: string; input: string };
  readonly extension: Extension<unknown>;
  readonly disabled: boolean;
  readonly config?: unknown;
  readonly source?: BackstagePlugin;
}

/**
 * The connections from this node to other nodes.
 * @public
 */
export interface AppNodeEdges {
  readonly attachedTo?: { node: AppNode; input: string };
  readonly attachments: Map<string, AppNode[]>;
}

/**
 * The instance of this node in the app graph.
 * @public
 */
export interface AppNodeInstance {
  getDataRefs(): ExtensionDataRef<unknown>[];
  getData<T>(ref: ExtensionDataRef<T>): T | unknown;
}

/**
 *
 * @public
 */
export interface AppNode {
  /** The specification for how this node should be instantiated */
  readonly spec: AppNodeSpec;
  /** The edges from this node to other nodes in the app graph */
  readonly edges: AppNodeEdges;
  /** The instance of this node, if it was instantiated */
  readonly instance?: AppNodeInstance;
}

export interface AppGraph {
  rootNodes: Map<string, AppNode>;
}
