import { Dispatch, iRootState } from '../store';
import { BuildSummary, GitType } from 'circleci-api';
import { CircleCIApi } from 'api';

export type BuildsState = {
  builds: BuildSummary[];
  pollingIntervalId: number | null;
  pollingState: PollingState;
};

const INTERVAL_AMOUNT = 1500;

export enum PollingState {
  Polling,
  Idle,
}
export const builds = {
  state: {
    builds: [] as BuildSummary[],
    pollingIntervalId: null,
    pollingState: PollingState.Idle,
  },
  reducers: {
    setBuilds(state: BuildsState, payload: BuildSummary[]) {
      if (state.pollingState !== PollingState.Polling) {
        return state;
      }
      return { ...state, builds: payload };
    },
    setPollingIntervalId(state: BuildsState, payload: number | null) {
      return {
        ...state,
        pollingIntervalId: payload,
        pollingState:
          payload === null ? PollingState.Idle : PollingState.Polling,
      };
    },
  },
  effects: (dispatch: Dispatch) => ({
    async getBuilds(api: CircleCIApi, state: iRootState) {
      try {
        const builds = await api.getBuilds({
          token: state.settings.token,
          vcs: {
            owner: state.settings.owner,
            repo: state.settings.repo,
            type: GitType.GITHUB,
          },
        });
        dispatch.builds.setBuilds(builds);
      } catch (e) {
        console.log(e);
      }
    },
    startPolling(api: CircleCIApi, state: iRootState) {
      if (state.builds.pollingIntervalId) return;

      const intervalId = (setInterval(
        () => dispatch.builds.getBuilds(api),
        INTERVAL_AMOUNT,
      ) as any) as number;
      dispatch.builds.setPollingIntervalId(intervalId);
    },
    stopPolling(_: any, state: iRootState) {
      const currentIntervalId = state.builds.pollingIntervalId;
      if (currentIntervalId) clearInterval(currentIntervalId);
      dispatch.builds.setPollingIntervalId(null);
    },
  }),
};
