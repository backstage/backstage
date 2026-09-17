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
import type { BreadcrumbEntryData } from './types';

interface Registration {
  update(label: string, href: string): void;
  unregister(): void;
}

interface BreadcrumbsContextValue {
  breadcrumbs: { items: BreadcrumbEntryData[] };
  register: (entry: BreadcrumbEntryData) => Registration;
}

// This key must match the one used by BreadcrumbsRegistryProvider in @backstage/plugin-app.
const CONTEXT_KEY = 'breadcrumbs-context';
const DEPTH_KEY = 'breadcrumbs-depth';

type ContextMap = { 1: BreadcrumbsContextValue };
type DepthMap = { 1: number };

const DepthContext = createVersionedContext<DepthMap>(DEPTH_KEY);

const EMPTY: { items: BreadcrumbEntryData[] } = { items: [] };

/**
 * Returns the current breadcrumb entries registered by page components anywhere
 * in the tree. Call this in components that render breadcrumbs (e.g. PluginHeader).
 *
 * @public
 */
export function useBreadcrumbEntries(): { items: BreadcrumbEntryData[] } {
  const ctx = useVersionedContext<ContextMap>(CONTEXT_KEY);
  return ctx?.atVersion(1)?.breadcrumbs ?? EMPTY;
}

/**
 * Registers a breadcrumb entry for the current page. The entry is added on
 * mount and removed on unmount. Wraps its children and increments the depth
 * counter so nested registrations are ordered correctly.
 *
 * @public
 */
export function BreadcrumbEntry(props: {
  entry: Omit<BreadcrumbEntryData, 'depth'>;
  children: ReactNode;
}) {
  const ctx = useVersionedContext<ContextMap>(CONTEXT_KEY);
  const register = ctx?.atVersion(1)?.register;
  const depthCtx = useVersionedContext<DepthMap>(DEPTH_KEY);
  const depth = depthCtx?.atVersion(1) ?? 0;
  const { label, href } = props.entry;
  const registrationRef = useRef<Registration | null>(null);

  useEffect(() => {
    if (!register) return undefined;
    const reg = register({ label, href, depth });
    registrationRef.current = reg;
    return () => {
      reg.unregister();
      registrationRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, depth]);

  useEffect(() => {
    registrationRef.current?.update(label, href);
  }, [label, href]);

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
