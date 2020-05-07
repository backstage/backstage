// import { Dispatch } from '../store'

export type SettingsState = {
  token: string;
  owner: string;
  repo: string;
};

export const settings = {
  state: {
    token: '!!!',
    owner: '',
    repo: '',
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    setToken(state: SettingsState, payload: string) {
      return { ...state, token: payload };
    },
    setOwner(state: SettingsState, payload: string) {
      return { ...state, owner: payload };
    },
    setRepo(state: SettingsState, payload: string) {
      return { ...state, repo: payload };
    },
  },
  // effects:
  // (dispatch: Dispatch) => ({
  //     // handle state changes with impure functions.
  //     // use async/await for async actions
  //     // async incrementAsync(payload, rootState) {
  //     //     await new Promise(resolve => setTimeout(resolve, 1000))
  //     //     dispatch.count.increment(payload)
  //     // },
  // }),
};
