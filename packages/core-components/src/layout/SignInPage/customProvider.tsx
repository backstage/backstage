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

import { useForm, UseFormRegisterReturn } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import isEmpty from 'lodash/isEmpty';
import { InfoCard } from '../InfoCard/InfoCard';
import { ProviderComponent, ProviderLoader, SignInProvider } from './types';
import { GridItem } from './styles';
import { UserIdentity } from './UserIdentity';
import { coreComponentsTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

// accept base64url format according to RFC7515 (https://tools.ietf.org/html/rfc7515#section-3)
const ID_TOKEN_REGEX = /^[a-z0-9_\-]+\.[a-z0-9_\-]+\.[a-z0-9_\-]+$/i;

/** @public */
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
    subTitle: {
      whiteSpace: 'pre-line',
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

const Component: ProviderComponent = ({ onSignInStarted, onSignInSuccess }) => {
  const classes = useFormStyles();
  const { t } = useTranslationRef(coreComponentsTranslationRef);
  const { register, handleSubmit, formState } = useForm<Data>({
    mode: 'onChange',
  });

  const { errors } = formState;

  const handleResult = ({ userId, idToken }: Data) => {
    onSignInStarted();
    onSignInSuccess(
      UserIdentity.fromLegacy({
        userId,
        getIdToken: idToken !== undefined ? async () => idToken : undefined,
        profile: {
          email: `${userId}@example.com`,
        },
      }),
    );
  };

  return (
    <GridItem>
      <InfoCard title={t('signIn.customProvider.title')} variant="fullHeight">
        <Typography variant="body1" className={classes.subTitle}>
          {t('signIn.customProvider.subtitle')}
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit(handleResult)}>
          <FormControl>
            <TextField
              {...asInputRef(register('userId', { required: true }))}
              label={t('signIn.customProvider.userId')}
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
                    t('signIn.customProvider.tokenInvalid'),
                }),
              )}
              label={t('signIn.customProvider.idToken')}
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
            {t('signIn.customProvider.continue')}
          </Button>
        </form>
      </InfoCard>
    </GridItem>
  );
};

// Custom provider doesn't store credentials
const loader: ProviderLoader = async () => undefined;

export const customProvider: SignInProvider = { Component, loader };
