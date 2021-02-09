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
import { Button, Observable, Subscription, useApi } from '@backstage/core';
import {
  Button as Action,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

export const JobStatusModal = ({
  task,
  toCatalogLink,
  open,
  onModalClose,
}: Props) => {
  const eventStream = useTaskEventStream(task?.id!);

  const renderTitle = () => {
    switch (task?.status) {
      case 'completed':
        return 'Successfully created component';
      case 'failed':
        return 'Failed to create component';
      default:
        return 'Create component';
    }
  };
  const onClose = useCallback(() => {
    if (!task) {
      return;
    }
    // Disallow closing modal if the job is in progress.
    if (task.status !== 'processing') {
      onModalClose();
    }
  }, [task, onModalClose]);

  console.log(eventStream);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle id="responsive-dialog-title">{renderTitle()}</DialogTitle>
      <DialogContent>
        {task?.spec.steps
          .filter(step => !!eventStream?.steps?.[step.id])
          .map(step => (
            <JobStage
              log={eventStream?.steps?.[step.id].log ?? []}
              name={step.name}
              key={step.name}
              startedAt={eventStream?.steps?.[step.id].startedAt}
              endedAt={eventStream?.steps?.[step.id].endedAt}
              status={eventStream?.steps?.[step.id].status ?? []}
            />
          ))}
      </DialogContent>
      {/* {job?.status && toCatalogLink && (
        <DialogActions>
          <Button to={toCatalogLink}>View in catalog</Button>
        </DialogActions>
      )}
      {job?.status === 'FAILED' && (
        <DialogActions>
          <Action onClick={onClose}>Close</Action>
        </DialogActions>
      )} */}
    </Dialog>
  );
};
