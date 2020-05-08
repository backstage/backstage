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
import { GitType, BuildWithSteps } from 'circleci-api';
import { CircleCIApi } from '../../api';

export type BuildState = {
  builds: Record<number, BuildWithSteps>;
  pollingIntervalId: number | null;
  pollingState: PollingState;
  getBuildError: Error | null;
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
    getBuildError: null,
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
    setBuildError(state: BuildState, payload: Error | null) {
      return { ...state, getBuildError: payload };
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
        dispatch.buildWithSteps.setBuildError(null);
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
        dispatch.buildWithSteps.setBuildError(e);
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
