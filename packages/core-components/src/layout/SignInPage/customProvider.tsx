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

import { useForm } from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { cn } from '../../lib/utils';
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

type Data = {
  userId: string;
  idToken?: string;
};

const Component: ProviderComponent = ({ onSignInStarted, onSignInSuccess }) => {
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
        <p className="text-base text-foreground whitespace-pre-line">
          {t('signIn.customProvider.subtitle')}
        </p>

        <form
          className="flex flex-col flex-nowrap"
          onSubmit={handleSubmit(handleResult)}
        >
          <div className="mt-4">
            <Label htmlFor="userId">{t('signIn.customProvider.userId')}</Label>
            <Input
              id="userId"
              {...register('userId', { required: true })}
              className={cn('mt-1', errors.userId && 'border-destructive')}
            />
            {errors.userId && (
              <p className="mt-1 text-sm text-destructive">
                {errors.userId.message}
              </p>
            )}
          </div>
          <div className="mt-4">
            <Label htmlFor="idToken">
              {t('signIn.customProvider.idToken')}
            </Label>
            <Input
              id="idToken"
              autoComplete="off"
              {...register('idToken', {
                required: false,
                validate: token =>
                  !token ||
                  ID_TOKEN_REGEX.test(token) ||
                  t('signIn.customProvider.tokenInvalid'),
              })}
              className={cn('mt-1', errors.idToken && 'border-destructive')}
            />
            {errors.idToken && (
              <p className="mt-1 text-sm text-destructive">
                {errors.idToken.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            variant="outline"
            className="self-center mt-4"
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
