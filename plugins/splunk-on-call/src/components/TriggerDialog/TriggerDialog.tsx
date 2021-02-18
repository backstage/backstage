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
import { useApi, alertApiRef } from '@backstage/core';
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
  users: User[];
  incidentCreator: User;
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
      minWidth: `calc(100% - ${theme.spacing(2)}px)`,
    },
    targets: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
  }),
);

export const TriggerDialog = ({
  users,
  incidentCreator,
  showDialog,
  handleDialog,
  onIncidentCreated: onIncidentCreated,
}: Props) => {
  const alertApi = useApi(alertApiRef);
  const api = useApi(splunkOnCallApiRef);
  const classes = useStyles();

  const [userTargets, setUserTargets] = useState<string[]>([]);
  const [policyTargets, setPolicyTargets] = useState<string[]>([]);
  const [detailsValue, setDetails] = useState<string>('');
  const [summaryValue, setSummary] = useState<string>('');
  const [isMultiResponderValue, setIsMultiResponder] = useState<string>('1');

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

  const {
    value: policies,
    loading: policiesLoaading,
    error: policiesError,
  } = useAsync(async () => {
    const allPolicies = await api.getEscalationPolicies();
    return allPolicies;
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
    ...userTargets.map(user => ({ slug: user, type: TargetType.UserValue })),
    ...policyTargets.map(user => ({
      slug: user,
      type: TargetType.EscalationPolicyValue,
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
  }, [value, alertApi, handleDialog, onIncidentCreated]);

  if (triggerError) {
    alertApi.post({
      message: `Failed to trigger alarm. ${triggerError.message}`,
      severity: 'error',
    });
  }

  return (
    <Dialog maxWidth="md" open={showDialog} onClose={handleDialog} fullWidth>
      <DialogTitle>This action will trigger an incident</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom align="justify">
          Created by:{' '}
          <b>
            {incidentCreator?.firstName} {incidentCreator?.lastName}
          </b>
        </Typography>
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
        <div style={{ marginTop: '1em' }}>
          <Typography color="textSecondary" gutterBottom>
            Select the targets
          </Typography>
          <div className={classes.targets}>
            <FormControl className={classes.formControl}>
              <InputLabel>Select Users</InputLabel>
              <Select
                id="user-targets"
                multiple
                value={userTargets}
                onChange={handleUserTargets}
                input={<Input />}
                renderValue={selected => (
                  <div className={classes.chips}>
                    {(selected as string[]).map(selectedUser => {
                      const element = users.find(
                        user => user.username === selectedUser,
                      );
                      return (
                        <Chip
                          key={selectedUser}
                          label={`${element?.firstName} ${element?.lastName}`}
                          className={classes.chip}
                        />
                      );
                    })}
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
              <InputLabel>Select Teams / Policies</InputLabel>
              <Select
                id="policy-targets"
                multiple
                value={policyTargets}
                onChange={handlePolicyTargets}
                input={<Input />}
                renderValue={selected => (
                  <div className={classes.chips}>
                    {(selected as string[]).map(selectedPolicy => {
                      const element = policies?.find(
                        policy => policy.policy.slug === selectedPolicy,
                      );
                      return (
                        <Chip
                          key={selectedPolicy}
                          label={element?.policy.name}
                          className={classes.chip}
                        />
                      );
                    })}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {!policiesError &&
                  !policiesLoaading &&
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
          </div>
        </div>
        <Typography
          style={{ marginTop: '1em' }}
          color="textSecondary"
          gutterBottom
        >
          Acknowledge Behavior
        </Typography>
        <FormControl className={classes.formControl}>
          <Select
            id="multi-responder"
            value={isMultiResponderValue}
            onChange={isMultiResponderChanged}
            inputProps={{ 'data-testid': 'trigger-select-behavior' }}
          >
            <MenuItem value="1">
              Stop paging after a single escalation policy or user has
              acknowledged
            </MenuItem>
            <MenuItem value="0">
              Continue paging until each escalation policy or user above has
              acknowledged
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          required
          inputProps={{ 'data-testid': 'trigger-summary-input' }}
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
          inputProps={{ 'data-testid': 'trigger-body-input' }}
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
            !detailsValue ||
            !summaryValue ||
            (!userTargets.length && !policyTargets.length) ||
            triggerLoading
          }
          variant="contained"
          onClick={() =>
            handleTriggerAlarm(
              summaryValue,
              detailsValue,
              incidentCreator.username!,
              targets(),
              !!Number(isMultiResponderValue),
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
