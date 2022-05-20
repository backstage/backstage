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
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';
import React, { createContext, ReactNode, useContext } from 'react';

/**
 * Type of `SidebarPinStateContext`
 *
 * @public @deprecated
 * Use `SidebarPinState` instead.
 */
export type SidebarPinStateContextType = {
  isPinned: boolean;
  toggleSidebarPinState: () => any;
  isMobile?: boolean;
};

/**
 * The pin state of the sidebar.
 *
 * @public
 */
export type SidebarPinState = {
  isPinned: boolean;
  toggleSidebarPinState: () => any;
  isMobile?: boolean;
};

const defaultSidebarPinStateContext = {
  isPinned: true,
  toggleSidebarPinState: () => {},
  isMobile: false,
};

/**
 * Contains the state on how the `Sidebar` is rendered
 *
 * @public @deprecated
 * Use `<SidebarPinStateContextProvider>` + `useSidebarPinState()` instead.
 */
export const LegacySidebarPinStateContext =
  createContext<SidebarPinStateContextType>(defaultSidebarPinStateContext);

const VersionedSidebarPinStateContext = createVersionedContext<{
  1: SidebarPinState;
}>('sidebar-pin-state-context');

/**
 * Provides state for how the `Sidebar` is rendered
 *
 * @public
 */
export const SidebarPinStateProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: SidebarPinStateContextType;
}) => (
  <LegacySidebarPinStateContext.Provider value={value}>
    <VersionedSidebarPinStateContext.Provider
      value={createVersionedValueMap({ 1: value })}
    >
      {children}
    </VersionedSidebarPinStateContext.Provider>
  </LegacySidebarPinStateContext.Provider>
);

/**
 * Hook to read and update sidebar pin state.
 *
 * @public
 */
export const useSidebarPinState = (): SidebarPinState => {
  const versionedSidebarContext = useContext(VersionedSidebarPinStateContext);

  // Invoked from outside a SidebarPinStateProvider: default value.
  if (versionedSidebarContext === undefined) {
    return defaultSidebarPinStateContext;
  }

  const sidebarContext = versionedSidebarContext.atVersion(1);
  if (sidebarContext === undefined) {
    throw new Error('No context found for version 1.');
  }

  return sidebarContext;
};
