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

import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import {
  Loading,
  getDefaultState,
  DefaultLoadingAction,
  getLoadingActions,
} from '../types';
import { useBackdropStyles as useStyles } from '../utils/styles';
import { useConfig } from './useConfig';

export type LoadingContextProps = {
  state: Loading;
  dispatch: Dispatch<Partial<SetStateAction<Loading>>>;
  actions: Array<string>;
};

export type LoadingProviderProps = {
  children: ReactNode;
};

export type MapLoadingToProps<T> = (props: LoadingContextProps) => T;

export const LoadingContext = createContext<LoadingContextProps | undefined>(
  undefined,
);

function reducer(prevState: Loading, action: Partial<Loading>): Loading {
  return {
    ...prevState,
    ...action,
  } as Record<string, boolean>;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const classes = useStyles();
  const { products } = useConfig();
  const actions = useMemo(() => getLoadingActions(products.map(p => p.kind)), [
    products,
  ]);
  const [state, dispatch] = useReducer(reducer, getDefaultState(actions));
  const [isBackdropVisible, setBackdropVisible] = useState(false);

  useEffect(() => {
    function displayLoadingBackdrop() {
      // Initial page loading is handled by progress bar
      setBackdropVisible(
        !state[DefaultLoadingAction.CostInsightsInitial] &&
          Object.values(state).some(l => l),
      );
    }
    displayLoadingBackdrop();
  }, [state, setBackdropVisible]);

  return (
    <LoadingContext.Provider value={{ state, actions, dispatch }}>
      {children}
      <Backdrop open={isBackdropVisible} classes={classes}>
        <CircularProgress />
      </Backdrop>
    </LoadingContext.Provider>
  );
};

export function useLoading<T>(mapLoadingToProps: MapLoadingToProps<T>): T {
  const context = useContext(LoadingContext);

  if (!context) {
    assertNever();
  }

  return mapLoadingToProps({
    state: context.state,
    actions: context.actions,
    dispatch: context.dispatch,
  });
}

function assertNever(): never {
  throw Error('useLoading cannot be used outside of LoadingProvider');
}
