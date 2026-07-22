/*
 * Copyright 2026 The Backstage Authors
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { errorApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  executeRouteRef,
  goldenPathsApiRef,
  useGoldenPathContext,
} from '@backstage/plugin-golden-paths-react';

import { useGoldenPathTaskContext } from '../useGoldenPathTaskContext';

export const useCancelGoldenPath = () => {
  const [loading, setLoading] = useState(false);
  const goldenPathsApi = useApi(goldenPathsApiRef);
  const errorApi = useApi(errorApiRef);

  const triggerCancel = async (taskId: string) => {
    setLoading(true);
    try {
      await goldenPathsApi.cancelGoldenPathExecution(taskId);
    } catch (err) {
      errorApi.post(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { triggerCancel, cancelLoading: loading };
};

export const useStartOver = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const goldenPathsApi = useApi(goldenPathsApiRef);
  const errorApi = useApi(errorApiRef);
  const executeRoute = useRouteRef(executeRouteRef);
  const { setDefaultParams } = useGoldenPathContext();
  const {
    value: { goldenPathTask: task, getGoldenPathTask },
  } = useGoldenPathTaskContext();

  const startOverGoldenPath = async () => {
    setLoading(true);
    try {
      const parameters = task.spec.parameters || {};
      const entityRef = task.spec.goldenPathInfo?.entityRef;
      const entity = task.spec.goldenPathInfo?.entity;

      if (!entityRef || !entity) {
        return;
      }

      if (Object.keys(parameters).length) {
        const { namespace, name } = entity.metadata;
        setDefaultParams(parameters);
        navigate(`/golden-paths/${namespace}/${name}/initial-params`);
      } else {
        const { taskId } = await goldenPathsApi.startGoldenPath({
          goldenPathRef: entityRef,
          values: {},
        });
        await getGoldenPathTask(taskId);
        navigate(executeRoute({ taskId }));
      }
    } catch (err) {
      errorApi.post(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return {
    startOverGoldenPath,
    startOverLoading: loading,
  };
};
