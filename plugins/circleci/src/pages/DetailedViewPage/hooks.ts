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
import { errorApiRef, useApi } from '@backstage/core';
import { useContext, useEffect } from 'react';
import { circleCIApiRef, GitType } from '../../api/index';
import { AppContext } from '../../components/Store';
import { useSettings } from '../SettingsPage/settings';

const INTERVAL_AMOUNT = 3000;

export function useBuildWithSteps(buildId: number) {
  const [settings] = useSettings();
  const [{ buildsWithSteps }, dispatch] = useContext(AppContext);
  const api = useApi(circleCIApiRef);
  const errorApi = useApi(errorApiRef);

  const getBuildWithSteps = async () => {
    try {
      const options = {
        token: settings.token,
        vcs: {
          owner: settings.owner,
          repo: settings.repo,
          type: GitType.GITHUB,
        },
      };
      const build = await api.getBuild(buildId, options);
      dispatch({ type: 'setBuildWithSteps', payload: build });
    } catch (e) {
      errorApi.post(e);
    }
  };

  const restartBuild = async () => {
    try {
      await api.retry(buildId, {
        token: settings.token,
        vcs: {
          owner: settings.owner,
          repo: settings.repo,
          type: GitType.GITHUB,
        },
      });
    } catch (e) {
      errorApi.post(e);
    }
  };

  const startPolling = () => {
    stopPolling();
    const intervalId = (setInterval(
      () => getBuildWithSteps(),
      INTERVAL_AMOUNT,
    ) as any) as number;
    dispatch({
      type: 'setPollingIntervalIdForBuildsWithSteps',
      payload: intervalId,
    });
  };

  const stopPolling = () => {
    const currentIntervalId = buildsWithSteps.pollingIntervalId;
    if (currentIntervalId) clearInterval(currentIntervalId);
    dispatch({
      type: 'setPollingIntervalIdForBuildsWithSteps',
      payload: null,
    });
  };

  useEffect(() => {
    startPolling();
    return () => {
      stopPolling();
    };
  }, [buildId, settings]);

  const build = buildsWithSteps.builds[buildId];

  return [
    build,
    {
      restartBuild,
      startPolling,
      stopPolling,
      getBuildWithSteps,
    },
  ] as const;
}
