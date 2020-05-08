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
import { Dispatch, iRootState } from '../store';
import { circleCIApiRef } from '../../api';

const STORAGE_KEY = `${circleCIApiRef.id}.settings`;

export type SettingsState = {
  token: string;
  owner: string;
  repo: string;
};

export const settings = {
  state: {
    token: '',
    owner: '',
    repo: '',
  }, // initial state
  reducers: {
    setCredentials(
      state: SettingsState,
      { doPersist, ...credentials }: SettingsState & { doPersist: boolean },
    ) {
      return { ...state, ...credentials };
    },
  },
  effects: (dispatch: Dispatch) => ({
    setCredentials({
      doPersist = true,
      ...credentials
    }: SettingsState & { doPersist: boolean }) {
      if (doPersist) dispatch.settings.persist(credentials);
    },
    setRehydrateError(state: SettingsState, payload: Error | null) {
      return { ...state, rehydrateError: payload };
    },
    persist(credentials: SettingsState) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
    },
    rehydrate(_: any, state: iRootState) {
      try {
        dispatch.settings.setRehydrateError(null);
        const stateFromStorage = JSON.parse(
          sessionStorage.getItem(STORAGE_KEY)!,
        );
        if (
          stateFromStorage &&
          Object.keys(stateFromStorage).some(
            (k) => (state as any).settings[k] !== stateFromStorage[k],
          )
        )
          dispatch.settings.setCredentials({
            ...stateFromStorage,
            doPersist: false,
          });
      } catch (e) {
        dispatch.settings.setRehydrateError(e);
      }
    },
  }),
};
