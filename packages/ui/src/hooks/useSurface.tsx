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
import { Surface, Responsive } from '../types';

/** @public */
export interface SurfaceContextValue {
  surface: Responsive<Surface> | undefined;
}

/** @public */
export interface SurfaceProviderProps {
  surface: Responsive<Surface>;
  children: ReactNode;
}

/** @public */
export interface UseSurfaceOptions {
  /**
   * The surface value this component CREATES for its children (container behavior).
   * When 'auto', increments from parent surface.
   *
   * Use this for components like Box, Flex, Grid that establish surface context.
   */
  surface?: Responsive<Surface>;
  /**
   * The surface value this component is ON for styling (leaf behavior).
   * When 'auto', inherits from current surface.
   *
   * Use this for leaf components like Button that consume surface for styling.
   */
  onSurface?: Responsive<Surface>;
}

const SurfaceContext = createVersionedContext<{
  1: SurfaceContextValue;
}>('surface-context');

/**
 * Increments a surface level by one, capping at '3'.
 * Intent surfaces (danger, warning, success) remain unchanged.
 *
 * @internal
 */
function incrementSurface(surface: Surface | undefined): Surface {
  if (!surface) return '0'; // no context = root level
  if (surface === '0') return '1';
  if (surface === '1') return '2';
  if (surface === '2' || surface === '3') return '3'; // cap at max
  // Intent surfaces remain unchanged
  if (surface === 'danger') return 'danger';
  if (surface === 'warning') return 'warning';
  if (surface === 'success') return 'success';
  // 'auto' should not appear here, but handle it defensively
  if (surface === 'auto') return '1';
  return surface;
}

/**
 * Resolves a surface value for containers (SurfaceProvider).
 * When 'auto' is used, increments from the parent surface.
 * For responsive surfaces (objects), returns them as-is without resolution.
 *
 * @param contextSurface - The surface from context
 * @param requestedSurface - The requested surface value (may be 'auto')
 * @returns The resolved surface value
 * @internal
 */
export function resolveSurfaceForProvider(
  contextSurface: Responsive<Surface> | undefined,
  requestedSurface: Responsive<Surface> | undefined,
): Responsive<Surface> | undefined {
  if (!requestedSurface) {
    return contextSurface;
  }

  // If requestedSurface is a responsive object (breakpoint-based), return as-is
  if (typeof requestedSurface === 'object') {
    return requestedSurface;
  }

  // If contextSurface is a responsive object, we can't auto-increment from it
  // Return the requested surface as-is or default to '0' for auto
  if (typeof contextSurface === 'object') {
    if (requestedSurface === 'auto') {
      return '0'; // fallback to root when context is responsive
    }
    return requestedSurface;
  }

  // For containers, 'auto' means increment to create a new elevated context
  if (requestedSurface === 'auto') {
    return incrementSurface(contextSurface);
  }

  return requestedSurface;
}

/**
 * Resolves a surface value for leaf components (useSurface hook).
 * When 'auto' is used, inherits the current surface (doesn't increment).
 * For responsive surfaces (objects), returns them as-is without resolution.
 *
 * @param contextSurface - The surface from context
 * @param requestedSurface - The requested surface value (may be 'auto')
 * @returns The resolved surface value
 * @internal
 */
function resolveSurfaceForConsumer(
  contextSurface: Responsive<Surface> | undefined,
  requestedSurface: Responsive<Surface> | undefined,
): Responsive<Surface> | undefined {
  if (!requestedSurface) {
    return contextSurface;
  }

  // If requestedSurface is a responsive object (breakpoint-based), return as-is
  if (typeof requestedSurface === 'object') {
    return requestedSurface;
  }

  // For leaf components, 'auto' means inherit the current surface
  if (requestedSurface === 'auto') {
    // If context is responsive, fallback to '0'
    if (typeof contextSurface === 'object') {
      return '0';
    }
    return contextSurface;
  }

  return requestedSurface;
}

/**
 * Provider component that establishes the surface context for child components.
 * This allows components to adapt their styling based on their background surface.
 *
 * Note: The surface value should already be resolved before passing to this provider.
 * Container components should use useSurface with the surface parameter.
 *
 * @internal
 */
export const SurfaceProvider = ({
  surface,
  children,
}: SurfaceProviderProps) => {
  return (
    <SurfaceContext.Provider
      value={createVersionedValueMap({ 1: { surface } })}
    >
      {children}
    </SurfaceContext.Provider>
  );
};

/**
 * Hook to access the current surface context.
 * Returns the current surface level, or undefined if no provider is present.
 *
 * The parameter name determines the behavior:
 * - `surface`: Container behavior - 'auto' increments from parent
 * - `onSurface`: Leaf behavior - 'auto' inherits from parent
 *
 * @param options - Optional configuration for surface resolution
 * @internal
 */
export const useSurface = (
  options?: UseSurfaceOptions,
): SurfaceContextValue => {
  const value = useContext(SurfaceContext)?.atVersion(1);
  const context = value ?? { surface: undefined };

  // Infer behavior from which parameter is provided
  // 'surface' = provider behavior (increment)
  // 'onSurface' = consumer behavior (inherit)
  const isProvider = options?.surface !== undefined;
  const requestedSurface = options?.surface ?? options?.onSurface;

  const resolvedSurface = isProvider
    ? resolveSurfaceForProvider(context.surface, requestedSurface)
    : resolveSurfaceForConsumer(context.surface, requestedSurface);

  return {
    surface: resolvedSurface,
  };
};
