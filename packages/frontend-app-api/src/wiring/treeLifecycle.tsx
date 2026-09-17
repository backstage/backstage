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
  ApiHolder,
  AppNode,
  AppNodeInstance,
  AppTree,
  coreExtensionData,
  ExtensionDataRef,
  ExtensionFactoryMiddleware,
} from '@backstage/frontend-plugin-api';
import { FilterPredicate } from '@backstage/filter-predicates';
import { collectRouteIds } from '../routing/collectRouteIds';
import { ErrorCollector } from './createErrorCollector';
import {
  AppTreeApiProxy,
  instantiateAndInitializePhaseTree,
  RouteResolutionApiProxy,
} from './phaseApis';

export type BootstrapClassification = {
  deferredApiRoots: Set<AppNode>;
  deferredElementRoots: Set<AppNode>;
  deferredRoots: Set<AppNode>;
};

/**
 * Instantiates the bootstrap-visible portion of the app tree and returns the
 * element that should be rendered while the prepared app is still incomplete.
 *
 * The bootstrap tree deliberately stops at the session boundary so sign-in and
 * other deferred content can be handled separately during finalization.
 */
export function createBootstrapApp(options: {
  tree: AppTree;
  apis: ApiHolder;
  collector: ErrorCollector;
  routeRefsById: ReturnType<typeof collectRouteIds>;
  routeResolutionApi: RouteResolutionApiProxy;
  appTreeApi: AppTreeApiProxy;
  extensionFactoryMiddleware?: ExtensionFactoryMiddleware;
  disableSignIn?: boolean;
  skipBootstrapChild?(ctx: {
    node: AppNode;
    input: string;
    child: AppNode;
  }): boolean;
  onMissingApi?(ctx: { node: AppNode; apiRefId: string }): void;
  hasSignInPage(node?: AppNode): boolean;
}): {
  bootstrapApp: { element: JSX.Element; tree: AppTree };
  requiresSignIn: boolean;
} {
  const signInPageNode = getAppRootNode(options.tree)?.edges.attachments.get(
    'signInPage',
  )?.[0];

  instantiateAndInitializePhaseTree({
    tree: options.tree,
    apis: options.apis,
    collector: options.collector,
    extensionFactoryMiddleware: options.extensionFactoryMiddleware,
    routeResolutionApi: options.routeResolutionApi,
    appTreeApi: options.appTreeApi,
    routeRefsById: options.routeRefsById,
    stopAtAttachment: ({ node, input }) =>
      isSessionBoundaryAttachment(node, input),
    skipChild: options.skipBootstrapChild,
    onMissingApi: options.onMissingApi,
  });

  const element = options.tree.root.instance?.getData(
    coreExtensionData.reactElement,
  );
  if (!element) {
    throw new Error('Expected bootstrap tree to expose a root element');
  }

  return {
    bootstrapApp: {
      element,
      tree: options.tree,
    },
    requiresSignIn:
      !options.disableSignIn && options.hasSignInPage(signInPageNode),
  };
}

/**
 * Splits the app tree into bootstrap-visible and deferred regions.
 *
 * Predicate-gated roots are deferred to finalization, while any predicate that
 * still leaks into the bootstrap-visible region is reported and ignored.
 */
export function classifyBootstrapTree(options: {
  tree: AppTree;
  collector: ErrorCollector;
}): BootstrapClassification {
  const apiNodes = options.tree.root.edges.attachments.get('apis') ?? [];
  const deferredApiRoots = new Set(
    apiNodes.filter(apiNode => subtreeContainsPredicate(apiNode)),
  );
  const appRootElementNodes =
    getAppRootNode(options.tree)?.edges.attachments.get('elements') ?? [];
  const deferredElementRoots = new Set(
    appRootElementNodes.filter(elementNode =>
      subtreeContainsPredicate(elementNode),
    ),
  );
  const deferredRoots = new Set<AppNode>([
    ...deferredApiRoots,
    ...deferredElementRoots,
  ]);
  const bootstrapNodes = collectBootstrapVisibleNodes(options.tree, {
    deferredRoots,
  });

  for (const node of bootstrapNodes) {
    if (node.spec.if === undefined) {
      continue;
    }

    options.collector.report({
      code: 'EXTENSION_BOOTSTRAP_PREDICATE_IGNORED',
      message:
        `Extension '${node.spec.id}' uses 'if' during bootstrap, so the predicate was ignored. ` +
        "Move it behind 'app/root.children', onto a deferred 'app/root.elements' subtree, or into an API subtree.",
      context: {
        node,
      },
    });
    (node.spec as typeof node.spec & { if?: FilterPredicate }).if = undefined;
  }

  return {
    deferredApiRoots,
    deferredElementRoots,
    deferredRoots,
  };
}

/**
 * Prepares the app tree for finalization by removing the bootstrap-only
 * sign-in attachment from the app root boundary.
 */
export function prepareFinalizedTree(options: { tree: AppTree }) {
  for (const appRootNode of getFinalizationBoundaryNodes(options.tree)) {
    const attachments = appRootNode.edges.attachments as Map<string, AppNode[]>;
    attachments.delete('signInPage');
  }
}

/**
 * Clears instances inside the finalization boundary so those nodes can be
 * re-instantiated with finalized predicate context and API availability.
 */
export function clearFinalizationBoundaryInstances(tree: AppTree) {
  clearNodeInstance(tree.root);

  const visited = new Set<AppNode>();
  function visit(node: AppNode) {
    if (visited.has(node)) {
      return;
    }
    visited.add(node);
    clearNodeInstance(node);

    for (const [input, children] of node.edges.attachments) {
      // app/root.elements is allowed to keep its bootstrap instances so we only
      // re-run the parts of the boundary that actually change at finalization.
      if (node.spec.id === 'app/root' && input === 'elements') {
        continue;
      }

      for (const child of children) {
        visit(child);
      }
    }
  }

  for (const appRootNode of getFinalizationBoundaryNodes(tree)) {
    visit(appRootNode);
  }
}

/**
 * Identifies the attachment that separates bootstrap rendering from the
 * children that are deferred until finalization.
 */
export function isSessionBoundaryAttachment(node: AppNode, input: string) {
  return node.spec.id === 'app/root' && input === 'children';
}

/**
 * Injects a synthetic finalization child that throws the captured bootstrap
 * error when rendered.
 *
 * This lets the finalized tree reuse the normal app root error boundary rather
 * than introducing a separate error rendering path.
 */
export function attachThrowingFinalizationChild(tree: AppTree, error: Error) {
  const bootstrapChildNode =
    getAppRootNode(tree)?.edges.attachments.get('children')?.[0];
  if (!bootstrapChildNode) {
    throw error;
  }

  function ThrowBootstrapError(): never {
    throw error;
  }

  // This synthetic child gives the finalized tree a stable place to rethrow
  // bootstrap failures through the normal extension boundary stack.
  (bootstrapChildNode as AppNode & { instance?: AppNodeInstance }).instance = {
    getDataRefs() {
      return [coreExtensionData.reactElement];
    },
    getData<TValue>(dataRef: ExtensionDataRef<TValue>) {
      if (dataRef.id === coreExtensionData.reactElement.id) {
        return (<ThrowBootstrapError />) as TValue;
      }
      return undefined;
    },
  };
}

function getAppRootNode(tree: AppTree) {
  return tree.nodes.get('app/root');
}

function getFinalizationBoundaryNodes(tree: AppTree): AppNode[] {
  const nodes = new Set<AppNode>();
  const appRootNode = getAppRootNode(tree);
  if (appRootNode) {
    nodes.add(appRootNode);
  }
  const attachedAppRootNode = tree.root.edges.attachments.get('app')?.[0];
  if (attachedAppRootNode) {
    nodes.add(attachedAppRootNode);
  }
  return Array.from(nodes);
}

function clearNodeInstance(node: AppNode) {
  (node as AppNode & { instance?: AppNodeInstance }).instance = undefined;
}

function collectBootstrapVisibleNodes(
  tree: AppTree,
  options?: { deferredRoots?: Set<AppNode> },
) {
  const visibleNodes = new Set<AppNode>();

  function visit(node: AppNode) {
    if (visibleNodes.has(node)) {
      return;
    }
    visibleNodes.add(node);

    for (const [input, children] of node.edges.attachments) {
      if (isSessionBoundaryAttachment(node, input)) {
        continue;
      }

      for (const child of children) {
        if (options?.deferredRoots?.has(child)) {
          continue;
        }
        visit(child);
      }
    }
  }

  visit(tree.root);

  return visibleNodes;
}

function subtreeContainsPredicate(root: AppNode) {
  const visited = new Set<AppNode>();

  function visit(node: AppNode): boolean {
    if (visited.has(node)) {
      return false;
    }
    visited.add(node);

    if (node.spec.if !== undefined) {
      return true;
    }

    for (const children of node.edges.attachments.values()) {
      for (const child of children) {
        if (visit(child)) {
          return true;
        }
      }
    }

    return false;
  }

  return visit(root);
}
