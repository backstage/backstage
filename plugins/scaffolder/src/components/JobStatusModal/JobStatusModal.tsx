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
import React, { useEffect } from 'react';
import {
  Dialog,
  LinearProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { JobStage } from '../JobStage/JobStage';
import { useJobPolling } from './useJobPolling';
import { Job } from '../../types';
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
    if (job?.status === 'COMPLETED') onComplete(job);
  }, [job, onComplete]);

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
