/*
 * Copyright 2020 Spotify AB
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

import React, { createContext, PropsWithChildren, useContext } from 'react';
import { AppContext } from './types';

const Context = createContext<AppContext | undefined>(undefined);

type Props = {
  appContext: AppContext;
};

export const AppContextProvider = ({
  appContext,
  children,
}: PropsWithChildren<Props>) => (
  <Context.Provider value={appContext} children={children} />
);

export const useApp = (): AppContext => {
  const appContext = useContext(Context);
  if (!appContext) {
    throw new Error('No app context available');
  }
  return appContext;
};
