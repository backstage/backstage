/*
 * Copyright 2020 The Backstage Authors
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

import type { AppNode } from '@backstage/frontend-plugin-api';
import { useVersionedContext } from '@backstage/version-bridge';

/**
 * React hook providing access to the current {@link AppNode}.
 *
 * @public
 * @remarks
 *
 * This hook returns the {@link AppNode} from the closest extension context.
 * The app supplies this context around the complete React element output of
 * route-bearing extensions, including headers outside their own boundaries.
 * The {@link (ExtensionBoundary:function)} component also supplies extension
 * context, including for extensions without a route path.
 *
 * If no extension context is available, this hook returns `undefined`.
 */
export function useAppNode(): AppNode | undefined {
  const versionedContext = useVersionedContext<{ 1: { node?: AppNode } }>(
    'app-node-context',
  );
  if (!versionedContext) {
    return undefined;
  }

  const context = versionedContext.atVersion(1);
  if (!context) {
    throw new Error('AppNodeContext v1 not available');
  }
  return context.node;
}
