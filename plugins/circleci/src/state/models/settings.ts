import { Dispatch } from '../store';
import { circleCIApiRef } from '../../api';
import { RootModel } from '.';

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
    setCredentials(state: SettingsState, payload: SettingsState) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch: Dispatch) => ({
    setCredentials(
      {
        credentials,
        doPersist = true,
      }: { credentials: SettingsState; doPersist?: boolean },
      state: RootModel,
    ) {
      const newState = { ...state.settings, ...credentials };

      if (doPersist) dispatch.settings.persist(newState);
      // dispatch.settings.setCredentials(newState);
    },
    persist(payload: RootModel) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    },
    rehydrate(_: any, state: RootModel) {
      try {
        const stateFromStorage = JSON.parse(
          sessionStorage.getItem(STORAGE_KEY)!,
        );
        console.log({ stateFromStorage, state });
        console.log(Object.keys(stateFromStorage));
        if (
          stateFromStorage &&
          Object.keys(stateFromStorage).some(
            k => (state as any).settings[k] !== stateFromStorage[k],
          )
        )
          // dispatch.settings.setCredentialsEffect({
          //   credentials: stateFromStorage,
          //   doPersist: false,
          // });
          dispatch.settings.setCredentials(stateFromStorage);
      } catch (e) {
        console.log(e);
      }
    },
    // handle state changes with impure functions.
    // use async/await for async actions
    // async incrementAsync(payload, rootState) {
    //     await new Promise(resolve => setTimeout(resolve, 1000))
    //     dispatch.count.increment(payload)
    // },
  }),
};
