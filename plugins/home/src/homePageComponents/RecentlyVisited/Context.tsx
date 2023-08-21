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

import React, { createContext } from 'react';
import { Visit } from '../../api/VisitsApi';

export type ContextValue = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  numVisitsOpen: number;
  setNumVisitsOpen: React.Dispatch<React.SetStateAction<number>>;
  numVisitsTotal: number;
  setNumVisitsTotal: React.Dispatch<React.SetStateAction<number>>;
  visits: Array<Visit>;
  setVisits: React.Dispatch<React.SetStateAction<Array<Visit>>>;
  loading: boolean;
  setLoading: React.Dispatch<boolean>;
};

const defaultContextValue = {
  collapsed: true,
  setCollapsed: () => {},
  numVisitsOpen: 3,
  setNumVisitsOpen: () => {},
  numVisitsTotal: 8,
  setNumVisitsTotal: () => {},
  visits: [],
  setVisits: () => {},
  loading: true,
  setLoading: () => {},
};

const Context = createContext<ContextValue>(defaultContextValue);

export const ContextProvider = ({ children }: { children: JSX.Element }) => {
  const [collapsed, setCollapsed] = React.useState(
    defaultContextValue.collapsed,
  );
  const [numVisitsOpen, setNumVisitsOpen] = React.useState(
    defaultContextValue.numVisitsOpen,
  );
  const [numVisitsTotal, setNumVisitsTotal] = React.useState(
    defaultContextValue.numVisitsTotal,
  );
  const [visits, setVisits] = React.useState<Array<Visit>>(
    defaultContextValue.visits,
  );
  const [loading, setLoading] = React.useState<boolean>(
    defaultContextValue.loading,
  );

  const value: ContextValue = {
    collapsed,
    setCollapsed,
    numVisitsOpen,
    setNumVisitsOpen,
    numVisitsTotal,
    setNumVisitsTotal,
    visits,
    setVisits,
    loading,
    setLoading,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useContext = () => {
  const value = React.useContext(Context);

  if (value === undefined)
    throw new Error(
      'RecentlyVisited useContext found undefined ContextValue, <ContextProvider/> could be missing',
    );

  return value;
};

export default Context;
