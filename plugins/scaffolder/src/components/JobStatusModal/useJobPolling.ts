import { useState, useEffect } from 'react';
import { Job } from './types';
import { useApi } from '@backstage/core';
import { scaffolderApiRef } from '../../api';

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

export const useJobPolling = (jobId: string | null) => {
  const scaffolderApi = useApi(scaffolderApiRef);

  const [job, setJob] = useState<Job | void>(undefined);
  useEffect(() => {
    if (!jobId) return;
    const stopPolling = poll(async () => {
      const nextJobState = await scaffolderApi.getJob(jobId);
      if (
        nextJobState.status === 'FAILED' ||
        nextJobState.status === 'COMPLETED'
      ) {
        stopPolling();
      }
      setJob(nextJobState);
    }, 500);
    return () => {
      stopPolling();
    };
  }, [jobId, setJob]);
  return job;
};
