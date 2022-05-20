/*
 * Copyright 2022 The Backstage Authors
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

import React, { createContext, ReactNode, useContext } from 'react';
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';

/**
 * Types for the `SidebarContext`
 *
 * @public @deprecated
 * Use `SidebarOpenState` instead.
 */
export type SidebarContextType = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

/**
 * The open state of the sidebar.
 *
 * @public
 */
export type SidebarOpenState = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const defaultSidebarContext = {
  isOpen: false,
  setOpen: () => {},
};

/**
 * Context whether the `Sidebar` is open
 *
 * @public @deprecated
 * Use `<SidebarContextProvider>` + `useSidebar()` instead.
 */
export const LegacySidebarContext = createContext<SidebarContextType>(
  defaultSidebarContext,
);

const VersionedSidebarContext = createVersionedContext<{
  1: SidebarOpenState;
}>('sidebar-open-state-context');

/**
 * Provides context for reading and updating sidebar state.
 *
 * @public
 */
export const SidebarOpenStateProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: SidebarOpenState;
}) => (
  <LegacySidebarContext.Provider value={value}>
    <VersionedSidebarContext.Provider
      value={createVersionedValueMap({ 1: value })}
    >
      {children}
    </VersionedSidebarContext.Provider>
  </LegacySidebarContext.Provider>
);

/**
 * Hook to read and update the sidebar's open state.
 *
 * @public
 */
export const useSidebarOpenState = (): SidebarOpenState => {
  const versionedSidebarContext = useContext(VersionedSidebarContext);

  // Invoked from outside a SidebarOpenStateProvider, return a default value.
  if (versionedSidebarContext === undefined) {
    return defaultSidebarContext;
  }

  const sidebarContext = versionedSidebarContext.atVersion(1);
  if (sidebarContext === undefined) {
    throw new Error('No context found for version 1.');
  }

  return sidebarContext;
};
