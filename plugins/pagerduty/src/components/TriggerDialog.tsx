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

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  TextField,
  makeStyles,
  DialogActions,
  Button,
  DialogContent,
  FormControl,
  FormHelperText,
} from '@material-ui/core';
import { Progress, useApi, alertApiRef, identityApiRef } from '@backstage/core';
import { useAsyncFn } from 'react-use';

const useStyles = makeStyles({
  warningText: {
    border: '1px solid rgba(245, 155, 35, 0.5)',
    backgroundColor: 'rgba(245, 155, 35, 0.2)',
    padding: '0.5em 1em',
  },
});

type Props = {
  name: string;
  integrationKey: string;
  onClose: () => void;
};

export const TriggerDialog = ({ name, integrationKey, onClose }: Props) => {
  const classes = useStyles();
  const [description, setDescription] = useState<string>('');
  const alertApi = useApi(alertApiRef);
  const identityApi = useApi(identityApiRef);
  const userId = identityApi.getUserId();

  const descriptionChanged = (event: any) => {
    setDescription(event.target.value);
  };

  const promiseFunc = () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Inside test await');
      }, 1000);
    });

  const [{ value, loading, error }, triggerAlarm] = useAsyncFn(async () => {
    return await promiseFunc();
  });

  useEffect(() => {
    if (value) {
      alertApi.post({
        message: `Alarm successfully triggered by ${userId}`,
      });
      onClose();
    }

    if (error) {
      alertApi.post({
        message: `Failed to trigger alarm, ${error.message}`,
        severity: 'error',
      });
    }
  }, [value, error]);

  return (
    <Dialog maxWidth="sm" open={true} onClose={onClose} fullWidth={true}>
      <DialogTitle>
        This action will send PagerDuty alarms and notifications to on-call
        people responsible for {name}.
      </DialogTitle>
      <DialogContent>
        <p className={classes.warningText}>
          Note: If the issue you are seeing does not need urgent attention,
          please get in touch with the responsible team using their preferred
          communications channel. For most views, you can find links to support
          and information channels by clicking the support button in the top
          right corner of the page. If the issue is urgent, please don't
          hesitate to trigger the alert.
        </p>
        <p>
          Please describe the problem you want to report. Be as descriptive as
          possible. Your Spotify username and a reference to the current page
          will automatically be sent amended to the alarm so that we can debug
          the issue and reach out to you if necessary.
        </p>
        <TextField
          id="description"
          multiline
          fullWidth
          rows="6"
          margin="normal"
          label="Problem description"
          onChange={descriptionChanged}
        />
      </DialogContent>
      <DialogActions>
        <Button
          id="trigger"
          color="secondary"
          disabled={!description || loading}
          onClick={triggerAlarm}
        >
          Trigger
        </Button>
        <Button id="close" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
      {loading && <Progress />}
    </Dialog>
  );
};
