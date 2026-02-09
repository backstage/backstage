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
import { Bg, Responsive } from '../types';
import { useBreakpoint } from './useBreakpoint';
import { resolveResponsiveValue } from './useDefinition/helpers';

/** @public */
export interface BgContextValue {
  bg: Bg | undefined;
}

/** @public */
export interface BgProviderProps {
  bg: Bg;
  children: ReactNode;
}

/** @public */
export interface UseBgOptions {
  /**
   * The bg mode of the component.
   *
   * - `'container'` — for components like Box, Card, Flex that establish bg context.
   *   If `bg` prop is provided, uses that value. Otherwise auto-increments from parent.
   * - `'leaf'` — for components like Button that consume bg context.
   *   Always auto-increments from parent context. The `bg` prop is ignored.
   */
  mode: 'container' | 'leaf';
  /**
   * The explicit bg value from the component's prop.
   * Only used in container mode — leaf mode ignores this.
   */
  bg?: Responsive<Bg>;
}

const BgContext = createVersionedContext<{
  1: BgContextValue;
}>('bg-context');

/**
 * Increments a neutral bg level by one, capping at 'neutral-4'.
 * Intent backgrounds (danger, warning, success) pass through unchanged.
 *
 * @param bg - The current bg value
 * @returns The incremented bg value
 * @internal
 */
function incrementNeutralBg(bg: Bg | undefined): Bg | undefined {
  if (!bg) return undefined;
  if (bg === 'neutral-1') return 'neutral-2';
  if (bg === 'neutral-2') return 'neutral-3';
  if (bg === 'neutral-3') return 'neutral-4';
  if (bg === 'neutral-4') return 'neutral-4'; // capped
  // Intent values pass through unchanged
  return bg;
}

/**
 * Resolves the bg value for a container component.
 *
 * - If an explicit bg prop is provided, use that.
 * - If no bg prop is provided but there is a parent context, auto-increment from parent.
 * - If no bg prop and no context, return undefined (no bg).
 *
 * @internal
 */
function resolveBgForContainer(
  contextBg: Bg | undefined,
  propBg: Bg | undefined,
): Bg | undefined {
  // Explicit bg prop takes priority
  if (propBg !== undefined) {
    return propBg;
  }

  // No explicit bg: auto-increment from context if available
  if (contextBg === undefined) {
    return undefined;
  }

  return incrementNeutralBg(contextBg);
}

/**
 * Resolves the bg value for a leaf component.
 *
 * Always auto-increments from parent context. If no context, returns undefined.
 *
 * @internal
 */
function resolveBgForLeaf(contextBg: Bg | undefined): Bg | undefined {
  if (contextBg === undefined) {
    return undefined;
  }

  return incrementNeutralBg(contextBg);
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
 * Hook to access and resolve the current bg context.
 *
 * All bg resolution logic lives here — callers only need to specify the mode
 * and (for containers) the explicit bg prop value.
 *
 * - **Container mode** — uses explicit `bg` if provided, otherwise auto-increments
 *   from parent context. Caps at `neutral-4`.
 * - **Leaf mode** — always auto-increments from parent context. No prop needed.
 * - **No options** — returns the raw context value without resolution.
 *
 * @param options - Configuration for bg resolution
 * @public
 */
export const useBg = (options?: UseBgOptions): BgContextValue => {
  const { breakpoint } = useBreakpoint();
  const value = useContext(BgContext)?.atVersion(1);
  const context = value ?? { bg: undefined };

  if (!options) {
    return context;
  }

  // Resolve responsive prop value to a scalar for the current breakpoint
  const resolvedPropBg =
    options.bg !== undefined
      ? resolveResponsiveValue(options.bg, breakpoint)
      : undefined;

  if (options.mode === 'leaf') {
    return { bg: resolveBgForLeaf(context.bg) };
  }

  return { bg: resolveBgForContainer(context.bg, resolvedPropBg) };
};
