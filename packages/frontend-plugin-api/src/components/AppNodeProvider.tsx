/*
 * Copyright 2025 The Backstage Authors
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
  createVersionedContext,
  createVersionedValueMap,
  useVersionedContext,
} from '@backstage/version-bridge';
import { AppNode } from '../apis';
import { ReactNode } from 'react';

const CONTEXT_KEY = 'app-node-context';

type AppNodeContextV1 = {
  node?: AppNode;
};

type AppNodeContextMap = {
  1: AppNodeContextV1;
};

const AppNodeContext = createVersionedContext<AppNodeContextMap>(CONTEXT_KEY);

/** @internal */
export function AppNodeProvider({
  node,
  children,
}: {
  node: AppNode;
  children: ReactNode;
}) {
  const versionedValue = createVersionedValueMap({ 1: { node } });

  return <AppNodeContext.Provider value={versionedValue} children={children} />;
}

/**
 * React hook providing access to the current {@link AppNode}.
 *
 * @public
 * @remarks
 *
 * This hook will return the {@link AppNode} for the closest extension. This
 * relies on the extension using the {@link (ExtensionBoundary:function)} component in its
 * implementation, which is included by default for all common blueprints.
 *
 * If the current component is not inside an {@link (ExtensionBoundary:function)}, it will
 * return `undefined`.
 */
export function useAppNode(): AppNode | undefined {
  const versionedContext = useVersionedContext<AppNodeContextMap>(CONTEXT_KEY);
  if (!versionedContext) {
    return undefined;
  }

  const context = versionedContext.atVersion(1);
  if (!context) {
    throw new Error('AppNodeContext v1 not available');
  }
  return context.node;
}
