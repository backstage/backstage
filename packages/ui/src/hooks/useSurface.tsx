/*
 * Copyright 2024 The Backstage Authors
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

/** @public */
export type SurfaceLevel = 'surface-0' | 'surface-1' | 'surface-2';

/** @public */
export interface SurfaceContextValue {
  surface: SurfaceLevel | undefined;
}

/** @public */
export interface SurfaceProviderProps {
  surface: SurfaceLevel;
  children: ReactNode;
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
 * @public
 */
export const useSurface = (): SurfaceContextValue => {
  return useContext(SurfaceContext);
};
