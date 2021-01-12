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

import { errorApiRef, useApi } from '@backstage/core';
import { BackstageTheme } from '@backstage/theme';
import {
  Button,
  FormControl,
  FormHelperText,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMountedState } from 'react-use';
import { ComponentIdValidators } from '../util/validate';
import { useGithubRepos } from '../util/useGithubRepos';
import { ConfigSpec } from './ImportComponentPage';
import { catalogApiRef } from '@backstage/plugin-catalog';
import { urlType } from '../util/urls';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  form: {
    alignItems: 'flex-start',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  submit: {
    marginTop: theme.spacing(1),
  },
}));

type Props = {
  nextStep: () => void;
  saveConfig: (configFile: ConfigSpec) => void;
  repository: string;
};

export const RegisterComponentForm = ({
  nextStep,
  saveConfig,
  repository,
}: Props) => {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onChange',
  });
  const classes = useStyles();
  const hasErrors = !!errors.componentLocation;
  const dirty = formState?.isDirty;
  const catalogApi = useApi(catalogApiRef);

  const isMounted = useMountedState();
  const errorApi = useApi(errorApiRef);
  const { generateEntityDefinitions } = useGithubRepos();

  const onSubmit = async (formData: Record<string, string>) => {
    const { componentLocation: target } = formData;
    try {
      if (!isMounted()) return;
      const type = urlType(target);

      if (type === 'tree') {
        saveConfig({
          type,
          location: target,
          config: await generateEntityDefinitions(target),
        });
      } else {
        const data = await catalogApi.addLocation({ target });
        saveConfig({
          type,
          location: data.location.target,
          config: data.entities,
        });
      }
      nextStep();
    } catch (e) {
      errorApi.post(e);
    }
  };

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      className={classes.form}
    >
      <FormControl>
        <TextField
          id="registerComponentInput"
          variant="outlined"
          label="Repository URL"
          error={hasErrors}
          placeholder="https://github.com/backstage/backstage"
          name="componentLocation"
          required
          margin="normal"
          helperText={`Enter the full path to the repository in ${repository} to start tracking your component.`}
          inputRef={register({
            required: true,
            validate: ComponentIdValidators,
          })}
        />

        {errors.componentLocation && (
          <FormHelperText error={hasErrors} id="register-component-helper-text">
            {errors.componentLocation.message}
          </FormHelperText>
        )}
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={!dirty || hasErrors}
        className={classes.submit}
      >
        Next
      </Button>
    </form>
  );
};
