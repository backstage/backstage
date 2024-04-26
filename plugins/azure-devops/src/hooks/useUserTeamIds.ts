/*
 * Copyright 2021 The Backstage Authors
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

import { azureDevOpsApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';

export function useUserTeamIds(userId: string | undefined): {
  teamIds?: string[];
  loading: boolean;
  error?: Error;
} {
  const api = useApi(azureDevOpsApiRef);

  const {
    value: teamIds,
    loading,
    error,
  } = useAsync(() => {
    return userId ? api.getUserTeamIds(userId) : Promise.resolve(undefined);
  }, [userId, api]);

  return {
    teamIds,
    loading,
    error,
  };
}
