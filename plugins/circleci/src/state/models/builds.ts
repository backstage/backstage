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
import { BuildSummary, GitType } from 'circleci-api';
import { CircleCIApi } from '../../api';

export type BuildsState = {
  builds: BuildSummary[];
  pollingIntervalId: number | null;
  pollingState: PollingState;
  restartBuildError: Error | null;
  getBuildsError: Error | null;
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
    restartBuildError: null,
    getBuildsError: null,
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
    setRestartBuildError(state: BuildsState, payload: Error | null) {
      return { ...state, restartBuildError: payload };
    },
    setGetBuildsError(state: BuildsState, payload: Error | null) {
      return { ...state, getBuildsError: payload };
    },
  },
  effects: (dispatch: Dispatch) => ({
    async getBuilds(api: CircleCIApi, state: iRootState) {
      try {
        dispatch.builds.setGetBuildsError(null);
        const newBuilds = await api.getBuilds({
          token: state.settings.token,
          vcs: {
            owner: state.settings.owner,
            repo: state.settings.repo,
            type: GitType.GITHUB,
          },
        });
        dispatch.builds.setBuilds(newBuilds);
      } catch (e) {
        dispatch.builds.setGetBuildsError(null);
      }
    },
    async restartBuild(
      { api, buildId }: { api: CircleCIApi; buildId: number },
      state: iRootState,
    ) {
      try {
        dispatch.builds.setRestartBuildError(null);
        await api.retry(buildId, {
          token: state.settings.token,
          vcs: {
            owner: state.settings.owner,
            repo: state.settings.repo,
            type: GitType.GITHUB,
          },
        });
      } catch (e) {
        dispatch.builds.setRestartBuildError(e);
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
