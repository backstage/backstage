/*
 * Copyright 2023 The Backstage Authors
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
import React, { useState } from 'react';

import {
  Button,
  createStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Theme,
} from '@material-ui/core';
import SubjectIcon from '@material-ui/icons/Subject';

import CloseIcon from '@material-ui/icons/Close';

import { PodLogs } from './PodLogs';
import { ContainerScope } from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  }),
);

interface PodLogsDialogProps {
  podScope: ContainerScope;
}

export const PodLogsDialog = ({
  podScope: containerScope,
}: PodLogsDialogProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };
  return (
    <>
      <Dialog maxWidth="xl" fullWidth open={open} onClose={closeDialog}>
        <DialogTitle id="dialog-title">
          {containerScope.podName} - {containerScope.containerName} logs on
          cluster {containerScope.clusterName}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={closeDialog}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <PodLogs containerScope={containerScope} />
        </DialogContent>
      </Dialog>
      <Button
        variant="outlined"
        aria-label="get logs"
        component="label"
        onClick={openDialog}
        startIcon={<SubjectIcon />}
      >
        Logs
      </Button>
    </>
  );
};
