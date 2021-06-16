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

import React from 'react';
import { useForm } from 'react-hook-form';
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

const useFormStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  button: {
    alignSelf: 'center',
    marginTop: theme.spacing(2),
  },
}));

type Data = {
  userId: string;
  idToken?: string;
};

const Component: ProviderComponent = ({ onResult }) => {
  const classes = useFormStyles();
  const { register, handleSubmit, errors, formState } = useForm<Data>({
    mode: 'onChange',
  });

  const handleResult = ({ userId, idToken }: Data) => {
    console.log("Handling AzureClientSideProvider result");
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
      <InfoCard title="AzureAD client side" variant="fullHeight">
        <Typography variant="body1">
          IN DEVELOPMENT. YAY.
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit(handleResult)}>
          <Button
            type="submit"
            color="primary"
            variant="outlined"
            className={classes.button}
          >
            SIGN IN
          </Button>
        </form>
      </InfoCard>
    </GridItem>
  );
};

// Custom provider doesn't store credentials
const loader: ProviderLoader = async () => undefined;

export const azureClientSideProvider: SignInProvider = { Component, loader };
