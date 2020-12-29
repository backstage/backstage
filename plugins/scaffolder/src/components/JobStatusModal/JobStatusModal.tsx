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
import { Button } from '@backstage/core';
import {
  Button as Action,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
} from '@material-ui/core';

import React, { useCallback } from 'react';
import { Job } from '../../types';
import { JobStage } from '../JobStage/JobStage';

type Props = {
  job: Job | null;
  toCatalogLink?: string;
  open: boolean;
  onModalClose: () => void;
};

export const JobStatusModal = ({
  job,
  toCatalogLink,
  open,
  onModalClose,
}: Props) => {
  const renderTitle = () => {
    switch (job?.status) {
      case 'COMPLETED':
        return 'Successfully created component';
      case 'FAILED':
        return 'Failed to create component';
      default:
        return 'Create component';
    }
  };

  const onClose = useCallback(() => {
    if (!job) {
      return;
    }
    // Disallow closing modal if the job is in progress.
    if (job.status === 'COMPLETED' || job.status === 'FAILED') {
      onModalClose();
    }
  }, [job, onModalClose]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle id="responsive-dialog-title">{renderTitle()}</DialogTitle>
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
      {job?.status && toCatalogLink && (
        <DialogActions>
          <Button to={toCatalogLink}>View in catalog</Button>
        </DialogActions>
      )}
      {job?.status === 'FAILED' && (
        <DialogActions>
          <Action onClick={onClose}>Close</Action>
        </DialogActions>
      )}
    </Dialog>
  );
};
