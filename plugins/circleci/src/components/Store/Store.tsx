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
import { BuildSummary } from 'circleci-api';

export const AppContext = React.createContext<[AppState, Dispatch<Action>]>(
  [] as any,
);

type SettingsState = {
  owner: string;
  repo: string;
  token: string;
};

export enum PollingState {
  Polling,
  Idle,
}

export type BuildsState = {
  builds: BuildSummary[];
  pollingIntervalId: number | null;
  pollingState: PollingState;
};

export const STORAGE_KEY = `${circleCIApiRef.id}.settings`;

export type AppState = {
  settings: SettingsState;
  builds: BuildsState;
};

const initialState = {
  settings: {
    owner: '',
    repo: '',
    token: '',
  },
  builds: {
    builds: [],
    pollingIntervalId: null,
    pollingState: PollingState.Idle,
  },
};

type SettingsAction = {
  type: 'setCredentials';
  payload: {
    repo: string;
    owner: string;
    token: string;
  };
};

type BuildsAction =
  | {
      type: 'setBuilds';
      payload: BuildSummary[];
    }
  | {
      type: 'setPollingIntervalId';
      payload: number | null;
    };

type Action = SettingsAction | BuildsAction;

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'setCredentials':
      return {
        ...state,
        settings: { ...state.settings, ...(action.payload as {}) },
      };
    case 'setBuilds':
      return {
        ...state,
        builds: { ...state.builds, builds: action.payload },
      };
    case 'setPollingIntervalId':
      return {
        ...state,
        builds: {
          ...state.builds,
          pollingIntervalId: action.payload,
          pollingState:
            action.payload === null ? PollingState.Idle : PollingState.Polling,
        },
      };
    default:
      return state;
  }
};

export const Store: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={[state, dispatch]}>
      <div>{children}</div>
    </AppContext.Provider>
  );
};

export const withStore = (Component: React.ComponentType<any>) => () => (
  <Store>
    <Component />
  </Store>
);
