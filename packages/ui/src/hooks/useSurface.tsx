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

import { createContext, useContext, ReactNode } from 'react';
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
  onSurface?: Responsive<Surface>;
}

const SurfaceContext = createContext<SurfaceContextValue>({
  surface: undefined,
});

/**
 * Provider component that establishes the surface context for child components.
 * This allows components to adapt their styling based on their background surface.
 *
 * @public
 */
export const SurfaceProvider = ({
  surface,
  children,
}: SurfaceProviderProps) => {
  return (
    <SurfaceContext.Provider value={{ surface }}>
      {children}
    </SurfaceContext.Provider>
  );
};

/**
 * Hook to access the current surface context.
 * Returns the current surface level, or undefined if no provider is present.
 *
 * @param options - Optional configuration
 * @param options.onSurface - Override the context surface with a specific surface value
 * @public
 */
export const useSurface = (
  options?: UseSurfaceOptions,
): SurfaceContextValue => {
  const context = useContext(SurfaceContext);
  return {
    surface: options?.onSurface || context.surface,
  };
};
