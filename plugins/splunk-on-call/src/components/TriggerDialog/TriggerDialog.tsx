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
  DialogActions,
  Button,
  DialogContent,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  Input,
  Chip,
  createStyles,
  makeStyles,
  Theme,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { useApi, alertApiRef, identityApiRef } from '@backstage/core';
import { useAsync, useAsyncFn } from 'react-use';
import { splunkOnCallApiRef } from '../../api';
import { Alert } from '@material-ui/lab';
import { User } from '../types';
import { IncidentTarget, TargetType } from '../../api/types';

const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
    },
  },
};

type Props = {
  // name: string;
  users: User[];
  showDialog: boolean;
  handleDialog: () => void;
  onIncidentCreated: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: '100%',
    },
  }),
);

export const TriggerDialog = ({
  users,
  showDialog,
  handleDialog,
  onIncidentCreated: onIncidentCreated,
}: Props) => {
  const alertApi = useApi(alertApiRef);
  const identityApi = useApi(identityApiRef);
  const userName = identityApi.getUserId();
  const api = useApi(splunkOnCallApiRef);
  const classes = useStyles();

  const [userTargets, setUserTargets] = useState<string[]>([]);
  const [policyTargets, setPolicyTargets] = useState<string[]>([]);
  const [details, setDetails] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [isMultiResponder, setIsMultiResponder] = useState<string>('');

  const [
    { value, loading: triggerLoading, error: triggerError },
    handleTriggerAlarm,
  ] = useAsyncFn(
    async (
      summary: string,
      details: string,
      userName: string,
      targets: IncidentTarget[],
      isMultiResponder: boolean,
    ) =>
      await api.triggerAlarm({
        summary,
        details,
        userName,
        targets,
        isMultiResponder,
      }),
  );

  const { value: policies, loading, error } = useAsync(async () => {
    const policies = await api.getEscalationPolicies();
    return policies;
  });

  const handleUserTargets = (event: React.ChangeEvent<{ value: unknown }>) => {
    setUserTargets(event.target.value as string[]);
  };

  const handlePolicyTargets = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setPolicyTargets(event.target.value as string[]);
  };

  const detailsChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetails(event.target.value);
  };

  const summaryChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSummary(event.target.value);
  };

  const isMultiResponderChanged = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setIsMultiResponder(event.target.value as string);
  };

  const targets = (): IncidentTarget[] => [
    ...userTargets.map(user => ({ slug: user, type: TargetType.User })),
    ...policyTargets.map(user => ({
      slug: user,
      type: TargetType.EscalationPolicy,
    })),
  ];

  useEffect(() => {
    if (value) {
      alertApi.post({
        message: `Alarm successfully triggered`,
      });
      onIncidentCreated();
      handleDialog();
    }
  }, [value, alertApi, handleDialog, userName, onIncidentCreated]);

  if (triggerError) {
    alertApi.post({
      message: `Failed to trigger alarm. ${triggerError.message}`,
      severity: 'error',
    });
  }

  return (
    <Dialog maxWidth="md" open={showDialog} onClose={handleDialog} fullWidth>
      <DialogTitle>This action will trigger an incident.</DialogTitle>
      <DialogContent>
        <Alert severity="info">
          <Typography variant="body1" align="justify">
            If the issue you are seeing does not need urgent attention, please
            get in touch with the responsible team using their preferred
            communications channel. You can find information about the owner of
            this entity in the "About" card. If the issue is urgent, please
            don't hesitate to trigger the alert.
          </Typography>
        </Alert>
        <Typography
          variant="body1"
          style={{ marginTop: '1em' }}
          gutterBottom
          align="justify"
        >
          Please describe the problem you want to report. Be as descriptive as
          possible. Your signed in user and a reference to the current page will
          automatically be amended to the alarm so that the receiver can reach
          out to you if necessary.
        </Typography>
        <Card>
          <CardContent>
            <Typography color="textPrimary" gutterBottom>
              Select the targets
            </Typography>
            <FormControl className={classes.formControl}>
              <InputLabel>Select users</InputLabel>
              <Select
                id="user-targets"
                multiple
                value={userTargets}
                onChange={handleUserTargets}
                input={<Input />}
                renderValue={selected => (
                  <div className={classes.chips}>
                    {(selected as string[]).map(value => (
                      <Chip
                        key={value}
                        label={value}
                        className={classes.chip}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {users.map(user => (
                  <MenuItem key={user.email} value={user.username}>
                    {user.firstName} {user.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel>Select an escalation poilicy</InputLabel>
              <Select
                id="policy-targets"
                multiple
                value={policyTargets}
                onChange={handlePolicyTargets}
                input={<Input />}
                renderValue={selected => (
                  <div className={classes.chips}>
                    {(selected as string[]).map(value => (
                      <Chip
                        key={value}
                        label={value}
                        className={classes.chip}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {!error &&
                  !loading &&
                  policies &&
                  policies.map(policy => (
                    <MenuItem
                      key={policy.policy.slug}
                      value={policy.policy.slug}
                    >
                      {policy.policy.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
        <FormControl className={classes.formControl}>
          <InputLabel>Acknowledge Behavior</InputLabel>
          <Select
            id="multi-responder"
            value={isMultiResponder}
            onChange={isMultiResponderChanged}
          >
            <MenuItem value="1">
              Stop paging after a single Acknowledge from an escalation policy
              or user
            </MenuItem>
            <MenuItem value="0">
              Continue paging until each escalation policy or user above has
              acknowledged
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          required
          inputProps={{ 'data-testid': 'trigger-input' }}
          id="summary"
          multiline
          fullWidth
          rows="4"
          margin="normal"
          label="Incident summary"
          variant="outlined"
          onChange={summaryChanged}
        />
        <TextField
          required
          inputProps={{ 'data-testid': 'trigger-input' }}
          id="details"
          multiline
          fullWidth
          rows="2"
          margin="normal"
          label="Incident body"
          variant="outlined"
          onChange={detailsChanged}
        />
      </DialogContent>
      <DialogActions>
        <Button
          data-testid="trigger-button"
          id="trigger"
          color="secondary"
          disabled={
            !details ||
            !summary ||
            (!userTargets.length && !policyTargets.length) ||
            triggerLoading
          }
          variant="contained"
          onClick={() =>
            handleTriggerAlarm(
              summary,
              details,
              userName,
              targets(),
              !!Number(isMultiResponder),
            )
          }
          endIcon={triggerLoading && <CircularProgress size={16} />}
        >
          Trigger Incident
        </Button>
        <Button id="close" color="primary" onClick={handleDialog}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
