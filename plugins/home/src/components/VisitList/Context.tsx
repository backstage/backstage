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
import { ReactNode, createContext, useContext } from 'react';
import { colorVariants as defaultColorVariants } from '@backstage/theme';

const VisitListContext = createContext(defaultColorVariants);

/**
 * Hook to access color variants from the VisitList context
 * @public
 */
export const useColorVariants = () => {
  return useContext(VisitListContext);
};

/**
 * Props for VisitListContextProvider
 * @public
 */
export type VisitListContextProviderProps = {
  children: ReactNode;
  colorVariants?: Record<string, string[]>;
};

/**
 * Context provider for VisitList color variants (used for chip colors)
 * @public
 */
export const VisitListContextProvider = ({
  children,
  colorVariants = defaultColorVariants,
}: VisitListContextProviderProps) => {
  return (
    <VisitListContext.Provider value={colorVariants}>
      {children}
    </VisitListContext.Provider>
  );
};
