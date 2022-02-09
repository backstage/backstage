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

import { useCallback, useState } from 'react';

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

  return { state, toggleModal, setOpen };
}
