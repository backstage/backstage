import React, { useEffect } from 'react';
import {
  Dialog,
  LinearProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { JobStage } from './JobStage';
import { useJobPolling } from './useJobPolling';
import { Job } from './types';
import { ComponentEntityV1alpha1 } from '@backstage/catalog-model';
import { Button } from '@backstage/core';
import { entityRoute } from '@backstage/plugin-catalog';
import { generatePath } from 'react-router-dom';
type Props = {
  onClose: () => void;
  onComplete: (job: Job) => void;
  jobId: string;
  entity: ComponentEntityV1alpha1 | null;
};

export const JobStatusModal = ({
  onClose,
  jobId,
  onComplete,
  entity,
}: Props) => {
  const job = useJobPolling(jobId);

  useEffect(() => {
    if (job?.status === 'COMPLETED') onComplete(job as Job);
  }, [job]);
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
              endedAt={step.endedAt}
              status={step.status}
            />
          ))
        )}
      </DialogContent>
      {entity && (
        <DialogActions>
          <Button
            to={generatePath(entityRoute.path, {
              kind: entity.kind,
              optionalNamespaceAndName: [
                entity.metadata.namespace,
                entity.metadata.name,
              ]
                .filter(Boolean)
                .join(':'),
            })}
          >
            View in catalog
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
