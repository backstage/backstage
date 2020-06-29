import React from 'react';
import {
  Dialog,
  LinearProgress,
  DialogTitle,
  DialogContent,
} from '@material-ui/core';
import { JobStage } from './JobStage';
import { useJob } from './jobMocks';

type Props = {
  onClose: () => void;
  jobId: string;
};

export const JobStatusModal = ({ onClose, jobId }: Props) => {
  const job = useJob(jobId);
  return (
    <Dialog open onClose={onClose} fullWidth>
      <DialogTitle id="responsive-dialog-title">
        Creating component...
      </DialogTitle>
      <DialogContent>
        {!job ? (
          <LinearProgress />
        ) : (
          (job?.stages ?? []).map(step => (
            <JobStage
              log={step.log}
              name={step.name}
              key={step.name}
              startedAt={step.startedAt}
              finishedAt={step.finishedAt}
              status={step.status}
            />
          ))
        )}
      </DialogContent>
    </Dialog>
  );
};
