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
import { useState, useEffect } from 'react';
import { Job } from './types';
import { useApi } from '@backstage/core';
import { scaffolderApiRef } from '../../api';

const DEFAULT_POLLING_INTERVAL = 1000;
const poll = (thunk: () => Promise<void>, ms: number) => {
  let shouldStop = false;
  (async () => {
    while (!shouldStop) {
      await thunk();
      await new Promise(res => setTimeout(res, ms));
    }
  })();

  return () => {
    shouldStop = true;
  };
};

export const useJobPolling = (
  jobId: string | null,
  pollingInterval = DEFAULT_POLLING_INTERVAL,
) => {
  const scaffolderApi = useApi(scaffolderApiRef);
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (!jobId) return () => {};
    const stopPolling = poll(async () => {
      const nextJobState = await scaffolderApi.getJob(jobId);
      if (
        nextJobState.status === 'FAILED' ||
        nextJobState.status === 'COMPLETED'
      ) {
        stopPolling();
      }
      setJob(nextJobState);
    }, pollingInterval);
    return () => {
      stopPolling();
    };
  }, [jobId, setJob, scaffolderApi, pollingInterval]);

  return job;
};
