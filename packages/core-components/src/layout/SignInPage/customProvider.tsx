/*
 * Copyright 2020 The Backstage Authors
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

import React from 'react';
import { useForm, UseFormRegisterReturn } from 'react-hook-form';
import {
  Typography,
  Button,
  FormControl,
  TextField,
  FormHelperText,
  makeStyles,
} from '@material-ui/core';
import isEmpty from 'lodash/isEmpty';
import { InfoCard } from '../InfoCard/InfoCard';
import { ProviderComponent, ProviderLoader, SignInProvider } from './types';
import { GridItem } from './styles';

// accept base64url format according to RFC7515 (https://tools.ietf.org/html/rfc7515#section-3)
const ID_TOKEN_REGEX = /^[a-z0-9_\-]+\.[a-z0-9_\-]+\.[a-z0-9_\-]+$/i;

export type CustomProviderClassKey = 'form' | 'button';

const useFormStyles = makeStyles(
  theme => ({
    form: {
      display: 'flex',
      flexFlow: 'column nowrap',
    },
    button: {
      alignSelf: 'center',
      marginTop: theme.spacing(2),
    },
  }),
  { name: 'BackstageCustomProvider' },
);

type Data = {
  userId: string;
  idToken?: string;
};

const asInputRef = (renderResult: UseFormRegisterReturn) => {
  const { ref, ...rest } = renderResult;
  return {
    inputRef: ref,
    ...rest,
  };
};
const Component: ProviderComponent = ({ onResult }) => {
  const classes = useFormStyles();
  const { register, handleSubmit, formState } = useForm<Data>({
    mode: 'onChange',
  });

  const { errors } = formState;

  const handleResult = ({ userId, idToken }: Data) => {
    onResult({
      userId,
      profile: {
        email: `${userId}@example.com`,
      },
      getIdToken: idToken ? async () => idToken : undefined,
    });
  };

  return (
    <GridItem>
      <InfoCard title="Custom User" variant="fullHeight">
        <Typography variant="body1">
          Enter your own User ID and credentials.
          <br />
          This selection will not be stored.
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit(handleResult)}>
          <FormControl>
            <TextField
              {...asInputRef(register('userId', { required: true }))}
              label="User ID"
              margin="normal"
              error={Boolean(errors.userId)}
            />
            {errors.userId && (
              <FormHelperText error>{errors.userId.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl>
            <TextField
              {...asInputRef(
                register('idToken', {
                  required: false,
                  validate: token =>
                    !token ||
                    ID_TOKEN_REGEX.test(token) ||
                    'Token is not a valid OpenID Connect JWT Token',
                }),
              )}
              label="ID Token (optional)"
              margin="normal"
              autoComplete="off"
              error={Boolean(errors.idToken)}
            />
            {errors.idToken && (
              <FormHelperText error>{errors.idToken.message}</FormHelperText>
            )}
          </FormControl>
          <Button
            type="submit"
            color="primary"
            variant="outlined"
            className={classes.button}
            disabled={!formState?.isDirty || !isEmpty(errors)}
          >
            Continue
          </Button>
        </form>
      </InfoCard>
    </GridItem>
  );
};

// Custom provider doesn't store credentials
const loader: ProviderLoader = async () => undefined;

export const customProvider: SignInProvider = { Component, loader };
