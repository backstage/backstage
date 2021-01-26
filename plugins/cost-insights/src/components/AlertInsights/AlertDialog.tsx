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

import React, { useEffect, useRef, useState } from 'react';
import { default as CloseIcon } from '@material-ui/icons/Close';
import {
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  IconButton,
  DialogContent,
  Typography,
} from '@material-ui/core';
import {
  AlertAcceptForm,
  AlertDismissForm,
  AlertSnoozeForm,
} from '../../forms';
import { useAlertDialogStyles as useStyles } from '../../utils/styles';
import { choose } from '../../utils/alerts';
import { Alert, AlertForm, Maybe } from '../../types';

const DEFAULT_FORM_ID = 'alert-form';

type AlertDialogProps = {
  open: boolean;
  group: string;
  snoozed: Maybe<Alert>;
  accepted: Maybe<Alert>;
  dismissed: Maybe<Alert>;
  onClose: () => void;
  onSubmit: (data: any) => void;
};

export const AlertDialog = ({
  open,
  group,
  snoozed,
  accepted,
  dismissed,
  onClose,
  onSubmit,
}: AlertDialogProps) => {
  const classes = useStyles();
  const [isButtonDisabled, setDisabled] = useState(true);
  const acceptRef = useRef<Maybe<HTMLFormElement>>(null);
  const snoozeRef = useRef<Maybe<HTMLFormElement>>(null);
  const dismissRef = useRef<Maybe<HTMLFormElement>>(null);

  useEffect(() => {
    if (open) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [open]);

  function disableSubmit(isDisabled: boolean) {
    setDisabled(isDisabled);
  }

  function onDialogClose() {
    onClose();
    setDisabled(true);
  }

  const SnoozeForm: Maybe<AlertForm> = snoozed?.SnoozeForm ?? AlertSnoozeForm;
  const AcceptForm: Maybe<AlertForm> = accepted?.AcceptForm ?? AlertAcceptForm;
  const DismissForm: Maybe<AlertForm> =
    dismissed?.DismissForm ?? AlertDismissForm;

  const isSnoozingEnabled = !!snoozed?.onSnoozed;
  const isAcceptingEnabled = !!accepted?.onAccepted;
  const isDismissingEnabled = !!dismissed?.onDismissed;

  const isSnoozeFormDisabled = snoozed?.SnoozeForm === null;
  const isAcceptFormDisabled = accepted?.AcceptForm === null;
  const isDismissFormDisabled = dismissed?.DismissForm === null;
  const isFormDisabled =
    isSnoozeFormDisabled || isAcceptFormDisabled || isDismissFormDisabled;

  const status = [
    isSnoozingEnabled,
    isAcceptingEnabled,
    isDismissingEnabled,
  ] as const;

  const [Action, action, actioned] =
    choose(status, [
      ['Snooze', 'snooze', 'snoozed'],
      ['Accept', 'accept', 'accepted'],
      ['Dismiss', 'dismiss', 'dismissed'],
    ]) ?? [];

  const [title, subtitle] =
    choose(status, [
      [snoozed?.title, snoozed?.subtitle],
      [accepted?.title, accepted?.subtitle],
      [dismissed?.title, dismissed?.subtitle],
    ]) ?? [];

  const TransitionProps = {
    mountOnEnter: true,
    unmountOnExit: true,
    // Wait for child component to mount; avoid recycling refs.
    onEntered() {
      if (acceptRef.current) {
        acceptRef.current.id = DEFAULT_FORM_ID;
      }
      if (snoozeRef.current) {
        snoozeRef.current.id = DEFAULT_FORM_ID;
      }
      if (dismissRef.current) {
        dismissRef.current.id = DEFAULT_FORM_ID;
      }
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onDialogClose}
      scroll="body"
      maxWidth="lg"
      TransitionProps={TransitionProps}
    >
      <Box display="flex" justifyContent="flex-end">
        <IconButton
          className={classes.icon}
          disableRipple
          aria-label="close dialog"
          onClick={onDialogClose}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent className={classes.content}>
        <Box mb={1.5}>
          <Typography variant="h5">
            <b>{Action} this action item?</b>
          </Typography>
          <Typography variant="h6" color="textSecondary">
            <b>
              This action item will be {actioned} for all of {group}.
            </b>
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          bgcolor="alertBackground"
          p={2}
          mb={1.5}
          borderRadius={4}
        >
          <Typography>
            <b>{title}</b>
          </Typography>
          <Typography color="textSecondary">{subtitle}</Typography>
        </Box>
        {isSnoozingEnabled && !isSnoozeFormDisabled && (
          <SnoozeForm
            ref={snoozeRef}
            alert={snoozed!}
            onSubmit={onSubmit}
            disableSubmit={disableSubmit}
          />
        )}
        {isDismissingEnabled && !isDismissFormDisabled && (
          <DismissForm
            ref={dismissRef}
            alert={dismissed!}
            onSubmit={onSubmit}
            disableSubmit={disableSubmit}
          />
        )}
        {isAcceptingEnabled && !isAcceptFormDisabled && (
          <AcceptForm
            ref={acceptRef}
            alert={accepted!}
            onSubmit={onSubmit}
            disableSubmit={disableSubmit}
          />
        )}
      </DialogContent>
      <Divider />
      <DialogActions className={classes.actions} disableSpacing>
        {isFormDisabled ? (
          <Button
            type="button"
            color="primary"
            variant="contained"
            aria-label={action}
            onClick={() => onSubmit(null)}
          >
            {Action}
          </Button>
        ) : (
          <Button
            type="submit"
            color="primary"
            variant="contained"
            form={DEFAULT_FORM_ID}
            aria-label={action}
            disabled={isButtonDisabled}
          >
            {Action}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
