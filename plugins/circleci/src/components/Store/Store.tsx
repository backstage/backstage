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
import React, { FC, useReducer, Dispatch, Reducer } from 'react';
import { circleCIApiRef } from '../../api';
import { State, PollingState, Action, SettingsState } from './types';
export { SettingsState };

export const AppContext = React.createContext<[State, Dispatch<Action>]>(
  [] as any,
);
export const STORAGE_KEY = `${circleCIApiRef.id}.settings`;

const initialState: State = {
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
  buildsWithSteps: {
    builds: {},
    pollingIntervalId: null,
    pollingState: PollingState.Idle,
    getBuildError: null,
  },
};

const reducer: Reducer<State, Action> = (state, action) => {
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
    case 'setBuildWithSteps': {
      if (state.buildsWithSteps.pollingState !== PollingState.Polling) {
        return state;
      }
      return {
        ...state,
        buildsWithSteps: {
          ...state.buildsWithSteps,
          builds: {
            ...state.buildsWithSteps.builds,
            [action.payload.build_num!]: action.payload,
          },
        },
      };
    }
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
    case 'setPollingIntervalIdForBuildsWithSteps':
      return {
        ...state,
        buildsWithSteps: {
          ...state.buildsWithSteps,

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
