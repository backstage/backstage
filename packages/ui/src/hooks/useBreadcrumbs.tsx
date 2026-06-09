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
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

/**
 * A single breadcrumb entry registered by a page component.
 *
 * @public
 */
export interface BreadcrumbEntry {
  label: string;
  href?: string;
}

interface InternalEntry extends BreadcrumbEntry {
  depth: number;
}

interface BreadcrumbsStore {
  register(entry: InternalEntry): () => void;
  subscribe(listener: () => void): () => void;
  getEntries(): BreadcrumbEntry[];
}

function createBreadcrumbsStore(): BreadcrumbsStore {
  const entries: InternalEntry[] = [];
  const listeners = new Set<() => void>();

  function notify() {
    listeners.forEach(l => l());
  }

  return {
    register(entry: InternalEntry) {
      entries.push(entry);
      entries.sort((a, b) => a.depth - b.depth);
      notify();
      return () => {
        const idx = entries.indexOf(entry);
        if (idx >= 0) {
          entries.splice(idx, 1);
          notify();
        }
      };
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getEntries() {
      return entries.map(({ label, href }) => ({ label, href }));
    },
  };
}

const StoreContext = createContext<BreadcrumbsStore | undefined>(undefined);
const DepthContext = createContext(0);

/** @public */
export function BreadcrumbsRegistryProvider(props: { children: ReactNode }) {
  const [store] = useState(createBreadcrumbsStore);
  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
}

/**
 * Returns the current breadcrumb trail registered by page components anywhere
 * in the tree. Call this in components that render breadcrumbs (e.g. PluginHeader).
 *
 * @public
 */
export function useBreadcrumbs(): BreadcrumbEntry[] {
  const store = useContext(StoreContext);
  const [entries, setEntries] = useState<BreadcrumbEntry[]>(
    () => store?.getEntries() ?? [],
  );

  useEffect(() => {
    if (!store) return undefined;
    setEntries(store.getEntries());
    return store.subscribe(() => {
      setEntries(store.getEntries());
    });
  }, [store]);

  return entries;
}

/**
 * Registers a breadcrumb entry for the current page. The entry is added on
 * mount and removed on unmount. Wraps its children and increments the depth
 * counter so nested registrations are ordered correctly.
 *
 * @public
 */
export function BreadcrumbRegistration(props: {
  entry: BreadcrumbEntry;
  children: ReactNode;
}) {
  const store = useContext(StoreContext);
  const depth = useContext(DepthContext);
  const { label, href } = props.entry;

  useEffect(() => {
    if (!store) return undefined;
    return store.register({ label, href, depth });
  }, [store, depth, label, href]);

  return (
    <DepthContext.Provider value={depth + 1}>
      {props.children}
    </DepthContext.Provider>
  );
}
