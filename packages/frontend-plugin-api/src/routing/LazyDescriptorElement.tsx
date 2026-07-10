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

import { lazy, Suspense, useMemo } from 'react';
import type { RouteDescriptorLoader } from './RouteDescriptor';

/**
 * Props for {@link LazyDescriptorElement}.
 *
 * @public
 */
export interface LazyDescriptorElementProps {
  loader: RouteDescriptorLoader;
}

/**
 * Lazily resolves a {@link RouteDescriptorLoader} into an element, wrapped in
 * a `Suspense` boundary.
 *
 * Shared by page router adapter compilers as the fallback for rendering a
 * {@link RouteDescriptor} loader when there is no owning `AppNode` (e.g. an
 * opaque adapter subtree) to lazy-load via `ExtensionBoundary.lazy` instead.
 *
 * @public
 */
export function LazyDescriptorElement(props: LazyDescriptorElementProps) {
  const { loader } = props;
  const Lazy = useMemo(
    () =>
      lazy(() =>
        loader().then(element => ({
          default: () => element,
        })),
      ),
    [loader],
  );
  return (
    <Suspense fallback={null}>
      <Lazy />
    </Suspense>
  );
}
