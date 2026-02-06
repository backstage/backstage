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

/** @public */
export interface BgContextValue {
  bg: Responsive<Bg> | undefined;
}

/** @public */
export interface BgProviderProps {
  bg: Responsive<Bg>;
  children: ReactNode;
}

/** @public */
export type UseBgOptions =
  | {
      /**
       * Container mode: the explicit bg value from the component's prop.
       * If undefined, the container auto-increments from parent context.
       */
      bg: Responsive<Bg> | undefined;
    }
  | {
      /**
       * Leaf mode: automatically reads bg from context and increments by 1.
       * No prop is needed on the component.
       */
      leaf: true;
    };

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
  contextBg: Responsive<Bg> | undefined,
  propBg: Responsive<Bg> | undefined,
): Responsive<Bg> | undefined {
  // Explicit bg prop takes priority
  if (propBg !== undefined) {
    return propBg;
  }

  // No explicit bg: auto-increment from context if available
  if (contextBg === undefined) {
    return undefined;
  }

  // If context is a responsive object, we can't auto-increment
  if (typeof contextBg === 'object') {
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
function resolveBgForLeaf(
  contextBg: Responsive<Bg> | undefined,
): Responsive<Bg> | undefined {
  if (contextBg === undefined) {
    return undefined;
  }

  // If context is a responsive object, we can't auto-increment
  if (typeof contextBg === 'object') {
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
 * Supports two modes:
 * - **Container mode** (`{ bg }`) - for components like Box that establish bg context.
 *   If bg prop is provided, uses that value. If bg is undefined but parent context exists,
 *   auto-increments from parent.
 * - **Leaf mode** (`{ leaf: true }`) - for components like Button that consume bg context.
 *   Always auto-increments from parent context. No prop needed.
 *
 * @param options - Configuration for bg resolution
 * @public
 */
export const useBg = (options?: UseBgOptions): BgContextValue => {
  const value = useContext(BgContext)?.atVersion(1);
  const context = value ?? { bg: undefined };

  if (!options) {
    return context;
  }

  if ('leaf' in options) {
    return { bg: resolveBgForLeaf(context.bg) };
  }

  return { bg: resolveBgForContainer(context.bg, options.bg) };
};
