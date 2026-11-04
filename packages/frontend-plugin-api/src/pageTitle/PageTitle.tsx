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

import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import {
  createVersionedContext,
  createVersionedValueMap,
  useVersionedContext,
} from '@backstage/version-bridge';

interface Registration {
  update(title: string): void;
  unregister(): void;
}

interface PageTitleContextValue {
  register(entry: { title: string; depth: number }): Registration;
}

// These keys must match the ones used by the page title registry in @backstage/plugin-app.
const CONTEXT_KEY = 'page-title-context';
const DEPTH_KEY = 'page-title-depth';

type ContextMap = { 1: PageTitleContextValue };
type DepthMap = { 1: number };

const DepthContext = createVersionedContext<DepthMap>(DEPTH_KEY);

function useTitleRegistration(title: string | undefined, depth: number) {
  const ctx = useVersionedContext<ContextMap>(CONTEXT_KEY);
  const register = ctx?.atVersion(1)?.register;
  const registrationRef = useRef<Registration | null>(null);
  const hasTitle = Boolean(title);

  useEffect(() => {
    if (!register || !hasTitle) {
      return undefined;
    }
    const registration = register({ title: title!, depth });
    registrationRef.current = registration;
    return () => {
      registration.unregister();
      registrationRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, depth, hasTitle]);

  useEffect(() => {
    if (title) {
      registrationRef.current?.update(title);
    }
  }, [title]);
}

/**
 * Adds a segment to the document title for as long as it is mounted.
 *
 * @remarks
 *
 * Segments nest: a `PageTitle` or {@link usePageTitle} rendered within the
 * children of this component adds a segment after this one. How the segments
 * are turned into the final document title is decided by the app, see
 * {@link DocumentTitleApi}.
 *
 * Pages and sub-pages created with the page blueprints register their titles
 * automatically, so this is only needed for additional segments, such as the
 * name of the item that a page is showing.
 *
 * @public
 */
export function PageTitle(props: { title?: string; children?: ReactNode }) {
  const depthCtx = useVersionedContext<DepthMap>(DEPTH_KEY);
  const depth = depthCtx?.atVersion(1) ?? 0;

  useTitleRegistration(props.title, depth);

  const depthValue = useMemo(
    () => createVersionedValueMap({ 1: depth + 1 }),
    [depth],
  );

  return (
    <DepthContext.Provider value={depthValue}>
      {props.children}
    </DepthContext.Provider>
  );
}

/**
 * Adds a segment to the document title for as long as the calling component is
 * mounted.
 *
 * @remarks
 *
 * This is a hook version of {@link PageTitle}, for use in the innermost
 * component of a page. Passing an empty or undefined title adds no segment,
 * which is useful while the title is still loading.
 *
 * @example
 * ```tsx
 * function EntityPageContent() {
 *   const { entity } = useEntity();
 *   usePageTitle(entity.metadata.title ?? entity.metadata.name);
 *   // ...
 * }
 * ```
 *
 * @public
 */
export function usePageTitle(title: string | undefined): void {
  const depthCtx = useVersionedContext<DepthMap>(DEPTH_KEY);
  useTitleRegistration(title, depthCtx?.atVersion(1) ?? 0);
}
