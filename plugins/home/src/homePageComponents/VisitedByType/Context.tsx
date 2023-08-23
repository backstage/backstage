/*
 * Copyright 2023 The Backstage Authors
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

import React, { Dispatch, SetStateAction, createContext, useMemo } from 'react';
import { Visit } from '../../api/VisitsApi';
import { VisitedByTypeKind } from './Content';

export type ContextValueOnly = {
  collapsed: boolean;
  numVisitsOpen: number;
  numVisitsTotal: number;
  visits: Array<Visit>;
  loading: boolean;
  kind: VisitedByTypeKind;
};

export type ContextValue = ContextValueOnly & {
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  setNumVisitsOpen: Dispatch<SetStateAction<number>>;
  setNumVisitsTotal: Dispatch<SetStateAction<number>>;
  setVisits: Dispatch<SetStateAction<Array<Visit>>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setKind: Dispatch<SetStateAction<VisitedByTypeKind>>;
  setContext: Dispatch<SetStateAction<ContextValueOnly>>;
};

const defaultContextValueOnly: ContextValueOnly = {
  collapsed: true,
  numVisitsOpen: 3,
  numVisitsTotal: 8,
  visits: [],
  loading: true,
  kind: 'recent',
};

export const defaultContextValue: ContextValue = {
  ...defaultContextValueOnly,
  setCollapsed: () => {},
  setNumVisitsOpen: () => {},
  setNumVisitsTotal: () => {},
  setVisits: () => {},
  setLoading: () => {},
  setKind: () => {},
  setContext: () => {},
};

export const Context = createContext<ContextValue>(defaultContextValue);

const getFilteredSet =
  (
    setContext: Dispatch<SetStateAction<ContextValueOnly>>,
    contextKey: keyof ContextValueOnly,
  ) =>
  (e: SetStateAction<any>) =>
    setContext(state => ({
      ...state,
      [contextKey]: typeof e === 'function' ? e(state[contextKey]) : e,
    }));

export const ContextProvider = ({ children }: { children: JSX.Element }) => {
  const [context, setContext] = React.useState<ContextValueOnly>(
    defaultContextValueOnly,
  );
  const {
    setCollapsed,
    setNumVisitsOpen,
    setNumVisitsTotal,
    setVisits,
    setLoading,
    setKind,
  } = useMemo(
    () => ({
      setCollapsed: getFilteredSet(setContext, 'collapsed'),
      setNumVisitsOpen: getFilteredSet(setContext, 'numVisitsOpen'),
      setNumVisitsTotal: getFilteredSet(setContext, 'numVisitsTotal'),
      setVisits: getFilteredSet(setContext, 'visits'),
      setLoading: getFilteredSet(setContext, 'loading'),
      setKind: getFilteredSet(setContext, 'kind'),
    }),
    [setContext],
  );

  const value: ContextValue = {
    ...context,
    setContext,
    setCollapsed,
    setNumVisitsOpen,
    setNumVisitsTotal,
    setVisits,
    setLoading,
    setKind,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useContext = () => {
  const value = React.useContext(Context);

  if (value === undefined)
    throw new Error(
      'VisitedByType useContext found undefined ContextValue, <ContextProvider/> could be missing',
    );

  return value;
};

export default Context;
