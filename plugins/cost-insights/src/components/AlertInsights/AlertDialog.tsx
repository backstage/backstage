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
import { Alert, Maybe } from '../../types';

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

  const SnoozeForm = snoozed?.SnoozeForm ?? AlertSnoozeForm;
  const AcceptForm = accepted?.AcceptForm ?? AlertAcceptForm;
  const DismissForm = dismissed?.DismissForm ?? AlertDismissForm;

  const isSnoozeFormDisplayed = !!snoozed?.onSnoozed;
  const isAcceptFormDisplayed = !!accepted?.onAccepted;
  const isDismissFormDisplayed = !!dismissed?.onDismissed;

  const status = [
    isAcceptFormDisplayed,
    isSnoozeFormDisplayed,
    isDismissFormDisplayed,
  ] as const;

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
          onClick={onDialogClose}
        >
          <CloseIcon aria-label="close dialog" />
        </IconButton>
      </Box>
      <DialogContent className={classes.content}>
        <Box mb={1.5}>
          <Typography variant="h5">
            <b>
              {choose(status, ['Accept', 'Snooze', 'Dismiss'])} this action
              item?
            </b>
          </Typography>
          <Typography variant="h6" color="textSecondary">
            <b>
              This action item will be{' '}
              {choose(status, ['accepted', 'snoozed', 'dismissed'])} for all of{' '}
              {group}.
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
            <b>
              {choose(status, [
                accepted?.title,
                snoozed?.title,
                dismissed?.title,
              ])}
            </b>
          </Typography>
          <Typography color="textSecondary">
            {choose(status, [
              accepted?.subtitle,
              snoozed?.subtitle,
              dismissed?.subtitle,
            ])}
          </Typography>
        </Box>
        {isSnoozeFormDisplayed && (
          <SnoozeForm
            ref={snoozeRef}
            alert={snoozed!}
            onSubmit={onSubmit}
            disableSubmit={disableSubmit}
          />
        )}
        {isDismissFormDisplayed && (
          <DismissForm
            ref={dismissRef}
            alert={dismissed!}
            onSubmit={onSubmit}
            disableSubmit={disableSubmit}
          />
        )}
        {isAcceptFormDisplayed && (
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
        <Button
          disabled={isButtonDisabled}
          type="submit"
          form={DEFAULT_FORM_ID}
          variant="contained"
          color="primary"
        >
          {choose(status, ['Accept', 'Snooze', 'Dismiss'])}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
