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

import React, { ReactNode, useCallback, useContext, useState } from 'react';
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';

/**
 * The state of the search modal, as well as functions for changing the modal's
 * visibility.
 *
 * @public
 */
export type SearchModalValue = {
  state: {
    hidden: boolean;
    open: boolean;
  };
  toggleModal: () => void;
  setOpen: (open: boolean) => void;
};

const SearchModalContext = createVersionedContext<{
  1: SearchModalValue | undefined;
}>('search-modal-context');

/**
 * Props for the SearchModalProvider.
 * @public
 */
export type SearchModalProviderProps = {
  /**
   * Children which should have access to the SearchModal context and the
   * associated useSearchModal() hook.
   */
  children: ReactNode;

  /**
   * Pass true if the modal should be rendered initially.
   */
  showInitially?: boolean;
};

/**
 * A context provider responsible for storing and managing state related to the
 * search modal.
 *
 * @remarks
 * If you need to control visibility of the search toggle outside of the modal
 * itself, you can optionally place this higher up in the react tree where your
 * custom code and the search modal share the same context.
 *
 * @example
 * ```tsx
 * import {
 *   SearchModalProvider,
 *   SidebarSearchModal,
 * } from '@backstage/plugin-search';
 *
 * // ...
 *
 * <SearchModalProvider>
 *   <KeyboardShortcutSearchToggler />
 *   <SidebarSearchModal>
 *     {({ toggleModal }) => <SearchModal toggleModal={toggleModal} />}
 *   </SidebarSearchModal>
 * </SearchModalProvider>
 * ```
 *
 * @public
 */
export const SearchModalProvider = ({
  children,
  showInitially,
}: SearchModalProviderProps) => {
  const value = useSearchModal(showInitially);
  const versionedValue = createVersionedValueMap({ 1: value });
  return (
    <SearchModalContext.Provider value={versionedValue}>
      {children}
    </SearchModalContext.Provider>
  );
};

/**
 * Use this hook to manage the state of {@link SearchModal}
 * and change its visibility.
 *
 * @public
 *
 * @param initialState - pass `true` to make the modal initially visible
 * @returns an object containing the state of the modal together with
 * functions for changing the visibility of the modal.
 */
export function useSearchModal(initialState = false) {
  // Check for any existing parent context.
  const parentContext = useContext(SearchModalContext);
  const parentContextValue = parentContext?.atVersion(1);

  const [state, setState] = useState({
    hidden: !initialState,
    open: initialState,
  });

  const toggleModal = useCallback(
    () =>
      setState(prevState => ({
        open: true,
        hidden: !prevState.hidden,
      })),
    [],
  );

  const setOpen = useCallback(
    (open: boolean) =>
      setState(prevState => ({
        open: prevState.open || open,
        hidden: !open,
      })),
    [],
  );

  // Inherit from parent context, if set.
  return parentContextValue?.state
    ? parentContextValue
    : { state, toggleModal, setOpen };
}
