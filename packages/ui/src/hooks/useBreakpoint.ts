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
import { useMemo } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import type { Breakpoint } from '../types';

export const breakpoints: { name: string; id: Breakpoint; value: number }[] = [
  { name: 'Initial', id: 'initial', value: 0 },
  { name: 'Extra Small', id: 'xs', value: 640 },
  { name: 'Small', id: 'sm', value: 768 },
  { name: 'Medium', id: 'md', value: 1024 },
  { name: 'Large', id: 'lg', value: 1280 },
  { name: 'Extra Large', id: 'xl', value: 1536 },
];

const breakpointIndex = new Map<Breakpoint, number>(
  breakpoints.map((bp, i) => [bp.id, i]),
);

function bpIndex(key: Breakpoint): number {
  return breakpointIndex.get(key) ?? 0;
}

const IS_SERVER =
  typeof window === 'undefined' || typeof window.matchMedia === 'undefined';

function computeBreakpoint(): Breakpoint {
  if (IS_SERVER) {
    return 'initial';
  }
  for (let i = breakpoints.length - 1; i >= 0; i--) {
    if (window.matchMedia(`(min-width: ${breakpoints[i].value}px)`).matches) {
      return breakpoints[i].id;
    }
  }
  return 'initial';
}

// --- Singleton store ---
// `current` is initialized lazily on first client-side access.
// `listeners` is eagerly initialized since Set is safe to create on the server.

let current: Breakpoint | undefined;
const listeners = new Set<() => void>();
let initialized = false;

function ensureInitialized(): void {
  if (initialized || IS_SERVER) {
    return;
  }
  initialized = true;
  current = computeBreakpoint();

  // Register one listener per breakpoint. When any query fires, re-evaluate
  // all breakpoints to find the new active one. Notify subscribers only if
  // the active breakpoint actually changed.
  for (const bp of breakpoints) {
    const mql = window.matchMedia(`(min-width: ${bp.value}px)`);
    mql.addEventListener('change', () => {
      const next = computeBreakpoint();
      if (next !== current) {
        current = next;
        for (const cb of listeners) {
          cb();
        }
      }
    });
  }
}

function subscribe(callback: () => void): () => void {
  ensureInitialized();
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): Breakpoint {
  ensureInitialized();
  return current ?? 'initial';
}

function getServerSnapshot(): Breakpoint {
  return 'initial';
}

/** @public */
export const useBreakpoint = () => {
  const breakpoint = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return useMemo(
    () => ({
      breakpoint,
      up: (key: Breakpoint): boolean => bpIndex(breakpoint) >= bpIndex(key),
      down: (key: Breakpoint): boolean => bpIndex(breakpoint) < bpIndex(key),
    }),
    [breakpoint],
  );
};
