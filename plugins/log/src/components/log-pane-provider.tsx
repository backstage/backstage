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

import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { LogPaneContextState, logDrawerContext } from '../context/log-drawer';

export function LogPaneProvider({ children }: PropsWithChildren<{}>) {
  const [isOpen, setIsOpen] = useState(true);

  const doOpen = useCallback(() => {
    setIsOpen(true);
  }, []);
  const doClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value: LogPaneContextState = useMemo(
    () => ({
      open: doOpen,
      close: doClose,
      isOpen,
    }),
    [isOpen, doOpen, doClose],
  );

  return (
    <logDrawerContext.Provider value={value}>
      {children}
    </logDrawerContext.Provider>
  );
}
