/*
 * Copyright 2026 The Backstage Authors
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
  ExtensionPredicateContextProviderBlueprint,
} from '@backstage/frontend-plugin-api';
import { FilterPredicate } from '@backstage/filter-predicates';
import { instantiateAppNodeSubtree } from '../tree/instantiateAppNodeTree';
import { ErrorCollector } from './createErrorCollector';

export type PredicateContextProviderEntry = {
  node: AppNode;
  namespace: string;
} & (
  | { type: 'sync'; resolver: (options: { apis: ApiHolder }) => string[] }
  | {
      type: 'async';
      loader: (options: { apis: ApiHolder }) => Promise<string[]>;
    }
);

const EMPTY_API_HOLDER: ApiHolder = {
  get() {
    return undefined;
  },
};

function getNamespaceFromExtensionId(extensionId: string): string {
  const colonIndex = extensionId.indexOf(':');
  if (colonIndex === -1) {
    return extensionId;
  }
  return extensionId.slice(colonIndex + 1);
}

export function collectPredicateContextProviderEntries(options: {
  providerNodes: Iterable<AppNode>;
  collector: ErrorCollector;
}): PredicateContextProviderEntry[] {
  const entries: PredicateContextProviderEntry[] = [];

  for (const providerNode of options.providerNodes) {
    if (providerNode.spec.if !== undefined) {
      options.collector.report({
        code: 'PREDICATE_CONTEXT_PROVIDER_HAS_PREDICATE',
        message:
          `Extension predicate context provider '${providerNode.spec.id}' must not have an 'if' predicate ` +
          'because it would create a circular dependency. The predicate has been removed.',
        context: { node: providerNode },
      });
      (
        providerNode.spec as typeof providerNode.spec & {
          if?: FilterPredicate;
        }
      ).if = undefined;
    }

    const detachedNode = instantiateAppNodeSubtree({
      rootNode: providerNode,
      apis: EMPTY_API_HOLDER,
      collector: options.collector,
      writeNodeInstances: false,
      reuseExistingInstances: false,
    });
    if (!detachedNode) {
      continue;
    }

    const namespace = getNamespaceFromExtensionId(providerNode.spec.id);

    const resolver = detachedNode.instance?.getData(
      ExtensionPredicateContextProviderBlueprint.dataRefs.resolver,
    );
    if (resolver) {
      entries.push({ node: providerNode, namespace, type: 'sync', resolver });
      continue;
    }

    const loader = detachedNode.instance?.getData(
      ExtensionPredicateContextProviderBlueprint.dataRefs.loader,
    );
    if (loader) {
      entries.push({ node: providerNode, namespace, type: 'async', loader });
      continue;
    }

    options.collector.report({
      code: 'PREDICATE_CONTEXT_PROVIDER_INVALID',
      message: `Extension predicate context provider '${providerNode.spec.id}' did not output a resolver or loader`,
      context: { node: providerNode },
    });
  }

  return entries;
}
