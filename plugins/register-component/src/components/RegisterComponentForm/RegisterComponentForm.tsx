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

import React, { FC } from 'react';
import {
  Button,
  FormControl,
  FormHelperText,
  TextField,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { BackstageTheme } from '@backstage/theme';
import { ComponentIdValidators } from '../../util/validate';

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

type RegisterComponentProps = {
  onSubmit: (formData: Record<string, string>) => Promise<void>;
};

const RegisterComponentForm: FC<RegisterComponentProps> = ({ onSubmit }) => {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onChange',
  });
  const classes = useStyles();
  const hasErrors = !!errors.componentLocation;
  const dirty = formState?.dirty;

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
          label="Component service file URL"
          error={hasErrors}
          placeholder="https://example.com/user/some-service/blob/master/service-info.yaml"
          name="componentLocation"
          required
          margin="normal"
          helperText="Enter the full path to the service-info.yaml file in GHE to start tracking your component. It must be in a public repo, on the master branch."
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
        id="registerComponentFormSubmit"
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

export default RegisterComponentForm;
