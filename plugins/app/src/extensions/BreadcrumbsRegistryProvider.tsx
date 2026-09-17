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

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { BreadcrumbEntryData } from '@backstage/frontend-plugin-api';
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';

interface Registration {
  update(label: string, href: string): void;
  unregister(): void;
}

interface BreadcrumbsContextValue {
  breadcrumbs: { items: BreadcrumbEntryData[] };
  register: (entry: BreadcrumbEntryData) => Registration;
}

type ContextMap = { 1: BreadcrumbsContextValue };

const BreadcrumbsContext = createVersionedContext<ContextMap>(
  'breadcrumbs-context',
);

/**
 * Provides the breadcrumb registry to the component tree. This is the
 * provider side of the breadcrumbs system; the consumer side
 * ({@link @backstage/frontend-plugin-api#BreadcrumbEntry},
 * {@link @backstage/frontend-plugin-api#useBreadcrumbEntries}) lives in
 * `@backstage/frontend-plugin-api` and reads from the same versioned
 * context key (`'breadcrumbs-context'`).
 *
 * @internal
 */
export function BreadcrumbsRegistryProvider(props: { children: ReactNode }) {
  const [entries, setEntries] = useState<BreadcrumbEntryData[]>([]);

  const register = useCallback((entry: BreadcrumbEntryData): Registration => {
    const record = { ...entry };
    setEntries(prev => [...prev, record].sort((a, b) => a.depth - b.depth));
    return {
      update(label: string, href: string) {
        if (record.label === label && record.href === href) return;
        record.label = label;
        record.href = href;
        setEntries(prev => [...prev]);
      },
      unregister() {
        setEntries(prev => prev.filter(e => e !== record));
      },
    };
  }, []);

  const breadcrumbs = useMemo(
    () => ({
      items: entries.map(({ label, href, depth }) => ({ label, href, depth })),
    }),
    [entries],
  );

  const value = useMemo(
    () => createVersionedValueMap({ 1: { breadcrumbs, register } }),
    [breadcrumbs, register],
  );

  return (
    <BreadcrumbsContext.Provider value={value}>
      {props.children}
    </BreadcrumbsContext.Provider>
  );
}
