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
import React, { FC, useReducer, Dispatch } from 'react';
import { circleCIApiRef } from '../../api';

export const SettingsContext = React.createContext<
  [RootState, Dispatch<Action>]
>([] as any);

type SettingsState = {
  owner: string;
  repo: string;
  token: string;
};

export const STORAGE_KEY = `${circleCIApiRef.id}.settings`;

type RootState = {
  settings: SettingsState;
};

const initialState = {
  settings: {
    owner: '',
    repo: '',
    token: '',
  },
};

type Action = {
  type: 'setCredentials';
  payload: {
    repo: string;
    owner: string;
    token: string;
  };
};

const reducer = (state: RootState, action: Action): RootState => {
  switch (action.type) {
    case 'setCredentials':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    default:
      return state;
  }
};

export const Store: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <SettingsContext.Provider value={[state, dispatch]}>
      <div>{children}</div>
    </SettingsContext.Provider>
  );
};

export const withStore = (Component: React.ComponentType<any>) => () => (
  <Store>
    <Component />
  </Store>
);
