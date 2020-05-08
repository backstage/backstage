import { Dispatch, iRootState } from '../store';
import { GitType, BuildWithSteps } from 'circleci-api';
import { CircleCIApi } from '../../api';

export type BuildState = {
  builds: Record<number, BuildWithSteps>;
  pollingIntervalId: number | null;
  pollingState: PollingState;
};

const INTERVAL_AMOUNT = 1500;

export enum PollingState {
  Polling,
  Idle,
}
export const buildWithSteps = {
  state: {
    builds: {},
    pollingIntervalId: null,
    pollingState: PollingState.Idle,
  } as BuildState,
  reducers: {
    setBuild(state: BuildState, payload: BuildWithSteps) {
      if (state.pollingState !== PollingState.Polling) {
        return state;
      }
      return {
        ...state,
        builds: { ...state.builds, [payload.build_num!]: payload },
      };
    },
    setPollingIntervalId(state: BuildState, payload: number | null) {
      return {
        ...state,
        pollingIntervalId: payload,
        pollingState:
          payload === null ? PollingState.Idle : PollingState.Polling,
      };
    },
  },
  effects: (dispatch: Dispatch) => ({
    async getBuild(
      { api, buildId }: { api: CircleCIApi; buildId: number },
      state: iRootState,
    ) {
      try {
        const options = {
          token: state.settings.token,
          vcs: {
            owner: state.settings.owner,
            repo: state.settings.repo,
            type: GitType.GITHUB,
          },
        };
        const build = await api.getBuild(buildId, options);
        dispatch.buildWithSteps.setBuild(build);
      } catch (e) {
        console.log(e);
      }
    },
    startPolling(
      { api, buildId }: { api: CircleCIApi; buildId: number },
      state: iRootState,
    ) {
      if (state.buildWithSteps.pollingIntervalId) return;

      const intervalId = (setInterval(
        () => dispatch.buildWithSteps.getBuild({ buildId, api }),
        INTERVAL_AMOUNT,
      ) as any) as number;
      dispatch.buildWithSteps.setPollingIntervalId(intervalId);
    },
    stopPolling(_: any, state: iRootState) {
      const currentIntervalId = state.buildWithSteps.pollingIntervalId;
      if (currentIntervalId) clearInterval(currentIntervalId);
      dispatch.buildWithSteps.setPollingIntervalId(null);
    },
  }),
};
