import { useMemo, useState, useEffect } from 'react';
import { Job } from './types';

function* emulatePoll() {
  const now = () => new Date().toString();
  const job: Job = {
    id: '132536-42362-4253532',
    metadata: { entity: {}, values: {} },
    status: 'STARTED',
    stages: [
      {
        name: 'created',
        startedAt: now(),
        log: [
          'Job id #rw-tstywe-tdsy was successfully created and placed in the queue',
        ],
        status: 'STARTED',
      },
    ],
  };
  let newTime = now();
  job.stages[0].finishedAt = newTime;
  job.stages.push({
    startedAt: newTime,
    name: 'preparing',
    log: ['preparing blahblah', 'some other stuuff'],
    status: 'COMPLETE',
  });
  yield job;

  newTime = now();
  job.stages[1].finishedAt = newTime;
  job.stages.push({
    startedAt: newTime,
    name: 'templating',
    log: ['templating blahblah', 'some other stuuff'],
    status: 'COMPLETE',
  });
  yield job;

  newTime = now();
  job.stages[2].finishedAt = newTime;
  job.stages.push({
    startedAt: newTime,
    name: 'pushing',
    log: ['pushing blahblah', 'some other stuuff'],
    status: 'STARTED',
  });
  yield job;
  yield job;
  job.stages[3].status = 'FAILED';
  job.stages[3].log.push('ERROR OCCURED');

  while (true) yield job;
}

export const useJob = (jobId: string | null) => {
  const apiMock = useMemo(() => emulatePoll(), [jobId]);
  const [job, setJob] = useState<Job | void>(undefined);
  useEffect(() => {
    if (!jobId) return;
    const nextJobState = apiMock.next().value as Job;
    setJob({ ...nextJobState });
    const intervalId = setInterval(() => {
      const nextJobState = apiMock.next().value as Job;

      if (nextJobState?.status === 'FAILED') {
        clearInterval(intervalId);
      }

      setJob({ ...nextJobState });
    }, 3000);
    return () => {
      clearInterval(intervalId);
    };
  }, [jobId, setJob]);
  return job;
};
