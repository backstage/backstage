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
import { useApi, errorApiRef, useRouteRef } from '@backstage/core-plugin-api';
import { JsonValue } from '@backstage/types';

import { goldenPathsApiRef } from '../../api';
import { useGoldenPathRef } from '../../hooks';
import { executeRouteRef } from '../../routes';

export const useStart = (initialParams?: Record<string, JsonValue>) => {
  const goldenPathRef = useGoldenPathRef();
  const goldenPathsApi = useApi(goldenPathsApiRef);
  const navigate = useNavigate();
  const errorApi = useApi(errorApiRef);
  const executeRoute = useRouteRef(executeRouteRef);
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    try {
      setIsStarting(true);
      const { taskId } = await goldenPathsApi.startGoldenPath({
        goldenPathRef,
        values: initialParams || {},
      });

      navigate(executeRoute({ taskId }));
    } catch (error) {
      errorApi.post(new Error(`Failed to start Golden Path, ${error}`));
    } finally {
      setIsStarting(false);
    }
  };

  return { handleStart, isStarting };
};
