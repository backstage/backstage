/*
 * Copyright 2024 The Backstage Authors
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
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';

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

export interface KubernetesDialogProps {
  buttonAriaLabel: string;
  buttonIcon: React.ReactNode;
  buttonText: string;
  children?: React.ReactNode;
  disabled?: boolean;
  title: string;
}

/**
 * Dialog component for use in the Kubernetes plugin
 *
 * @public
 */
export const KubernetesDialog = ({
  buttonAriaLabel,
  buttonIcon,
  buttonText,
  children,
  disabled,
  title,
}: KubernetesDialogProps) => {
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
      <Dialog
        maxWidth="xl"
        fullWidth
        open={open}
        onClose={closeDialog}
        PaperProps={{ className: classes.dialogPaper }}
      >
        <DialogTitle id="dialog-title">
          {title}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={closeDialog}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {children}
        </DialogContent>
      </Dialog>
      <Button
        variant="outlined"
        aria-label={buttonAriaLabel}
        component="label"
        disabled={disabled}
        onClick={openDialog}
        startIcon={buttonIcon}
      >
        {buttonText}
      </Button>
    </>
  );
};
