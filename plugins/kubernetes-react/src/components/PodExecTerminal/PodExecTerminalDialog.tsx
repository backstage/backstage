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
import CloseIcon from '@material-ui/icons/Close';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import React, { useState } from 'react';

import { useIsPodExecTerminalSupported } from '../../hooks';
import { PodExecTerminal, PodExecTerminalProps } from './PodExecTerminal';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogPaper: { minHeight: 'calc(100% - 64px)' },
    dialogContent: { flexBasis: 0 },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  }),
);

/**
 * Opens a terminal connected to the given pod's container in a dialog
 *
 * @public
 */
export const PodExecTerminalDialog = (props: PodExecTerminalProps) => {
  const classes = useStyles();
  const { clusterName, containerName, podName } = props;

  const [open, setOpen] = useState(false);

  const isPodExecTerminalSupported = useIsPodExecTerminalSupported();

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      {!isPodExecTerminalSupported.loading &&
        isPodExecTerminalSupported.value && (
          <Dialog
            maxWidth={false}
            fullWidth
            open={open}
            onClose={closeDialog}
            PaperProps={{ className: classes.dialogPaper }}
          >
            <DialogTitle id="dialog-title">
              {podName} - {containerName} terminal shell on cluster{' '}
              {clusterName}
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={closeDialog}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
              <PodExecTerminal {...props} />
            </DialogContent>
          </Dialog>
        )}

      <Button
        variant="outlined"
        aria-label="open terminal"
        component="label"
        disabled={
          isPodExecTerminalSupported.loading ||
          !isPodExecTerminalSupported.value
        }
        onClick={openDialog}
        startIcon={<OpenInBrowserIcon />}
      >
        Terminal
      </Button>
    </>
  );
};
