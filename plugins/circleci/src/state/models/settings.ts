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
    persist(credentials: SettingsState) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
    },
    rehydrate(_: any, state: iRootState) {
      try {
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
        console.log(e);
      }
    },
  }),
};
