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

import { useContext, ReactNode } from 'react';
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';
import { ContainerBg, ProviderBg, Responsive } from '../types';
import { useBreakpoint } from './useBreakpoint';
import { resolveResponsiveValue } from './useDefinition/helpers';

/** @public */
export interface BgContextValue {
  bg: ContainerBg | undefined;
}

/** @public */
export interface BgProviderProps {
  bg: ContainerBg;
  children: ReactNode;
}

const BgContext = createVersionedContext<{
  1: BgContextValue;
}>('bg-context');

/**
 * Increments a neutral bg level by one, capping at 'neutral-3'.
 * Intent backgrounds (danger, warning, success) pass through unchanged.
 *
 * The 'neutral-4' level is reserved for consumer component CSS and is
 * never set on providers.
 *
 * @internal
 */
function incrementNeutralBg(bg: ContainerBg | undefined): ContainerBg {
  if (!bg) return 'neutral-1';
  if (bg === 'neutral-1') return 'neutral-2';
  if (bg === 'neutral-2') return 'neutral-3';
  if (bg === 'neutral-3') return 'neutral-3'; // capped at neutral-3
  // Intent values pass through unchanged
  return bg;
}

/**
 * Provider component that establishes the bg context for child components.
 *
 * @public
 */
export const BgProvider = ({ bg, children }: BgProviderProps) => {
  return (
    <BgContext.Provider value={createVersionedValueMap({ 1: { bg } })}>
      {children}
    </BgContext.Provider>
  );
};

/**
 * Hook for consumer components (e.g. Button) to read the parent bg context.
 *
 * Returns the parent container's bg unchanged. The consumer component's CSS
 * handles the visual step-up (e.g. on a neutral-1 surface, the consumer
 * uses neutral-2 tokens via `data-on-bg`).
 *
 * @public
 */
export function useBgConsumer(): BgContextValue {
  const value = useContext(BgContext)?.atVersion(1);
  return value ?? { bg: undefined };
}

/**
 * Hook for provider components (e.g. Box, Card) to resolve and provide bg context.
 *
 * **Resolution rules:**
 *
 * - `bg` is `undefined` -- transparent, no context change, returns `{ bg: undefined }`.
 *   This is the default for Box, Flex, and Grid (they do **not** auto-increment).
 * - `bg` is a `ContainerBg` value -- uses that value directly (e.g. `'neutral-1'`).
 * - `bg` is `'neutral-auto'` -- increments the neutral level from the parent context,
 *   capping at `neutral-3`. Only components that explicitly pass `'neutral-auto'`
 *   (e.g. Card) will auto-increment; it is never implicit.
 *
 * **Capping:**
 *
 * Provider components cap at `neutral-3`. The `neutral-4` level is **not** a valid
 * prop value -- it exists only in consumer component CSS (e.g. a Button on a
 * `neutral-3` surface renders with `neutral-4` tokens via `data-on-bg`).
 *
 * The caller is responsible for wrapping children with `BgProvider` when the
 * resolved bg is defined.
 *
 * @public
 */
export function useBgProvider(bg?: Responsive<ProviderBg>): BgContextValue {
  const { breakpoint } = useBreakpoint();
  const context = useBgConsumer();

  if (bg === undefined) {
    return { bg: undefined };
  }

  const resolved = resolveResponsiveValue(bg, breakpoint);

  if (resolved === 'neutral-auto') {
    return { bg: incrementNeutralBg(context.bg) };
  }

  return { bg: resolved };
}
