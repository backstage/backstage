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
import { ContainerBg, Responsive } from '../types';
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

/** @public */
export interface UseBgOptions {
  /**
   * The bg mode of the component.
   *
   * - `'container'` — for components like Box, Card, Flex that establish bg context.
   *   If `bg` prop is provided, uses that value. Otherwise auto-increments from parent,
   *   capping at `neutral-3`.
   * - `'leaf'` — for components like Button that consume bg context.
   *   Returns the parent context bg unchanged (no increment). The leaf component's CSS
   *   handles the visual step-up. The `bg` prop is ignored.
   */
  mode: 'container' | 'leaf';
  /**
   * The explicit bg value from the component's prop.
   * Only used in container mode — leaf mode ignores this.
   */
  bg?: Responsive<ContainerBg>;
}

const BgContext = createVersionedContext<{
  1: BgContextValue;
}>('bg-context');

/**
 * Increments a neutral bg level by one, capping at 'neutral-3'.
 * Intent backgrounds (danger, warning, success) pass through unchanged.
 *
 * Only used by container components for auto-increment. The 'neutral-4'
 * level is reserved for leaf components and is never set on containers.
 *
 * @param bg - The current bg value
 * @returns The incremented bg value
 * @internal
 */
function incrementNeutralBg(
  bg: ContainerBg | undefined,
): ContainerBg | undefined {
  if (!bg) return undefined;
  if (bg === 'neutral-1') return 'neutral-2';
  if (bg === 'neutral-2') return 'neutral-3';
  if (bg === 'neutral-3') return 'neutral-3'; // capped at neutral-3
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
  contextBg: ContainerBg | undefined,
  propBg: ContainerBg | undefined,
): ContainerBg | undefined {
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
 * Returns the parent context bg unchanged. The leaf component's CSS
 * handles the visual step-up (e.g. on neutral-1 surface → use neutral-2 tokens).
 * If no context, returns undefined.
 *
 * @internal
 */
function resolveBgForLeaf(
  contextBg: ContainerBg | undefined,
): ContainerBg | undefined {
  return contextBg;
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
 *   from parent context. Caps at `neutral-3`.
 * - **Leaf mode** — returns the parent context bg unchanged. No prop needed.
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
