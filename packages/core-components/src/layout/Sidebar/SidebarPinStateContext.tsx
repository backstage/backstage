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
import React, { ReactNode, useContext } from 'react';

/**
 * Type of `SidebarPinStateContext`
 *
 * @public
 */
export type SidebarPinStateContextType = {
  isPinned: boolean;
  toggleSidebarPinState: () => any;
  isMobile?: boolean;
};

const VersionedSidebarPinStateContext = createVersionedContext<{
  1: SidebarPinStateContextType;
}>('sidebar-pin-state-context');

/**
 * Provides state for how the `Sidebar` is rendered
 *
 * @public
 */
export const SidebarPinStateContextProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: SidebarPinStateContextType;
}) => (
  <VersionedSidebarPinStateContext.Provider
    value={createVersionedValueMap({ 1: value })}
  >
    {children}
  </VersionedSidebarPinStateContext.Provider>
);

/**
 * Hook to read and update sidebar pin state.
 *
 * @public
 */
export const useSidebarPinState = (): SidebarPinStateContextType => {
  const versionedSidebarContext = useContext(VersionedSidebarPinStateContext);

  // Invoked from outside a SidebarPinStateContextProvider: default value.
  if (versionedSidebarContext === undefined) {
    return {
      isPinned: true,
      toggleSidebarPinState: () => {},
      isMobile: false,
    };
  }

  const sidebarContext = versionedSidebarContext.atVersion(1);
  if (sidebarContext === undefined) {
    throw new Error('No context found for version 1.');
  }

  return sidebarContext;
};
