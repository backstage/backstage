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

import { useRef } from 'react';
import {
  createVersionedContext,
  useVersionedContext,
} from '@backstage/version-bridge';
import type { AnalyticsTracker, UseAnalyticsFn } from './types';

/** @internal */
export const noopTracker: AnalyticsTracker = {
  captureEvent: () => {},
};

const noopUseAnalytics: UseAnalyticsFn = () => noopTracker;

/** @internal */
export type BUIContextValue = {
  useAnalytics?: UseAnalyticsFn;
};

/** @internal */
export const BUIContext = createVersionedContext<{
  1: BUIContextValue;
}>('bui');

/**
 * Returns an AnalyticsTracker for capturing analytics events.
 *
 * By default returns a noop tracker. When a `BUIProvider` is present
 * in the tree, returns the tracker provided by the consumer's hook.
 *
 * @public
 */
export function useAnalytics(): AnalyticsTracker {
  const ctx = useVersionedContext<{ 1: BUIContextValue }>('bui')?.atVersion(1);
  const impl = ctx?.useAnalytics ?? noopUseAnalytics;

  if (process.env.NODE_ENV !== 'production') {
    const prevImpl = useRef(impl);
    if (
      (prevImpl.current === noopUseAnalytics) !==
      (impl === noopUseAnalytics)
    ) {
      throw new Error(
        '@backstage/ui: The analytics hook changed between a noop and a real ' +
          'implementation. Ensure <BUIProvider> wraps all BUI components from first render.',
      );
    }
    prevImpl.current = impl;
  }

  return impl();
}
