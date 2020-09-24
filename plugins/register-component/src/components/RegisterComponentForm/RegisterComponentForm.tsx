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

import { BackstageTheme } from '@backstage/theme';
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import { useApi } from '@backstage/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ComponentIdValidators } from '../../util/validate';
import { githubAuthApiRef } from '@backstage/core-api';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  form: {
    alignItems: 'flex-start',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  hidden: {
    visibility: 'hidden',
  },
  submit: {
    marginTop: theme.spacing(1),
  },
  select: {
    minWidth: 120,
  },
}));

export type Props = {
  onSubmit: (formData: Record<string, string>) => Promise<void>;
  submitting?: boolean;
};

export const RegisterComponentForm = ({ onSubmit, submitting }: Props) => {
  const { control, register, handleSubmit, errors, formState } = useForm({
    mode: 'onChange',
  });
  const classes = useStyles();
  const hasErrors = !!errors.componentLocation;
  const dirty = formState?.isDirty;
  const githubAuthApi = useApi(githubAuthApiRef);

  const [token, setToken] = useState('');

  const handleClick = async () => {
    const tokenPromise = githubAuthApi.getAccessToken('repo, admin:org');
    const tokenWait = await tokenPromise;
    setToken(tokenWait);
  };

  return submitting ? (
    <LinearProgress data-testid="loading-progress" />
  ) : (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      className={classes.form}
      data-testid="register-form"
    >
      <FormControl>
        <TextField
          id="registerComponentInput"
          variant="outlined"
          label="Entity file URL"
          data-testid="componentLocationInput"
          error={hasErrors}
          placeholder="https://example.com/user/some-service/blob/master/catalog-info.yaml"
          name="componentLocation"
          required
          margin="normal"
          helperText="Enter the full path to the catalog-info.yaml file in GitHub, GitLab, Bitbucket or Azure to start tracking your component."
          inputRef={register({
            required: true,
            validate: ComponentIdValidators,
          })}
        />
        <FormControlLabel
          id="registerComponentCheckBox"
          name="componentPrivate"
          control={<Switch color="primary" name="switch" />}
          label="Private Repo"
          labelPlacement="end"
          onClick={handleClick}
        />

        <TextField
          name="componentToken"
          id="componentToken"
          className={classes.hidden}
          value={token}
          type="hidden"
          inputRef={register({})}
        />

        {errors.componentLocation && (
          <FormHelperText error={hasErrors} id="register-component-helper-text">
            {errors.componentLocation.message}
          </FormHelperText>
        )}
      </FormControl>

      <FormControl variant="outlined" className={classes.select}>
        <InputLabel id="scmLabel">Host type</InputLabel>
        <Controller
          control={control}
          name="scmType"
          defaultValue="AUTO"
          render={({ onChange, onBlur, value }) => (
            <Select
              labelId="scmLabel"
              id="scmSelect"
              label="scmLabel"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            >
              <MenuItem value="AUTO">Auto-detect</MenuItem>
              <MenuItem value="gitlab">GitLab</MenuItem>
              <MenuItem value="bitbucket/api">Bitbucket</MenuItem>
              <MenuItem value="azure/api">Azure</MenuItem>
            </Select>
          )}
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={!dirty || hasErrors}
        className={classes.submit}
      >
        Submit
      </Button>
    </form>
  );
};
