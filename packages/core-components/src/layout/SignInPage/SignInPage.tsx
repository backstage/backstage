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

import {
  BackstageIdentityResponse,
  configApiRef,
  SignInPageProps,
  useApi,
} from '@backstage/core-plugin-api';
import { UserIdentity } from './UserIdentity';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ComponentType, ReactNode, useState } from 'react';
import { useMountEffect } from '@react-hookz/web';
import { Progress } from '../../components/Progress';
import { Content } from '../Content/Content';
import { ContentHeader } from '../ContentHeader/ContentHeader';
import { Header } from '../Header';
import { InfoCard } from '../InfoCard';
import { Page } from '../Page';
import { getSignInProviders, useSignInProviders } from './providers';
import { GridItem, useStyles } from './styles';
import { IdentityProviders, SignInProviderConfig } from './types';
import { coreComponentsTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { useSearchParams } from 'react-router-dom';

type CommonSignInPageProps = SignInPageProps & {
  /**
   * Error component to be rendered instead of the default error panel in case
   * sign in fails.
   */
  ErrorComponent?: ComponentType<{ error?: Error }>;
};

type MultiSignInPageProps = CommonSignInPageProps & {
  providers: IdentityProviders;
  title?: string;
  titleComponent?: ReactNode;
  align?: 'center' | 'left';
};

type SingleSignInPageProps = CommonSignInPageProps & {
  provider: SignInProviderConfig;
  auto?: boolean;
};

export type Props = MultiSignInPageProps | SingleSignInPageProps;

export const MultiSignInPage = ({
  onSignInSuccess,
  providers = [],
  title,
  titleComponent,
  align = 'left',
}: MultiSignInPageProps) => {
  const configApi = useApi(configApiRef);
  const classes = useStyles();

  const signInProviders = getSignInProviders(providers);
  const [loading, providerElements] = useSignInProviders(
    signInProviders,
    onSignInSuccess,
  );

  if (loading) {
    return <Progress />;
  }

  return (
    <Page themeId="home">
      <Header title={configApi.getString('app.title')} />
      <Content>
        {(title || titleComponent) && (
          <ContentHeader
            title={title}
            titleComponent={titleComponent}
            textAlign={align}
          />
        )}
        <Grid
          container
          justifyContent={align === 'center' ? align : 'flex-start'}
          spacing={2}
          component="ul"
          classes={classes}
        >
          {providerElements}
        </Grid>
      </Content>
    </Page>
  );
};

export const SingleSignInPage = ({
  provider,
  auto,
  onSignInSuccess,
  ErrorComponent,
}: SingleSignInPageProps) => {
  const classes = useStyles();
  const authApi = useApi(provider.apiRef);
  const configApi = useApi(configApiRef);
  const { t } = useTranslationRef(coreComponentsTranslationRef);

  const [error, setError] = useState<Error>();

  // The SignIn component takes some time to decide whether the user is logged-in or not.
  // showLoginPage is used to prevent a glitch-like experience where the sign-in page is
  // displayed for a split second when the user is already logged-in.
  const [showLoginPage, setShowLoginPage] = useState<boolean>(false);

  // User was redirected back to sign in page with error from auth redirect flow
  const [searchParams, _setSearchParams] = useSearchParams();
  const errorParam = searchParams.get('error');

  type LoginOpts = { checkExisting?: boolean; showPopup?: boolean };
  const login = async ({ checkExisting, showPopup }: LoginOpts) => {
    try {
      let identityResponse: BackstageIdentityResponse | undefined;
      if (checkExisting) {
        // Do an initial check if any logged-in session exists
        identityResponse = await authApi.getBackstageIdentity({
          optional: true,
        });
      }

      // If no session exists, show the sign-in page
      if (!identityResponse && (showPopup || auto) && !errorParam) {
        // Unless auto is set to true, this step should not happen.
        // When user intentionally clicks the Sign In button, autoShowPopup is set to true
        setShowLoginPage(true);
        identityResponse = await authApi.getBackstageIdentity({
          instantPopup: true,
        });
        if (!identityResponse) {
          throw new Error(
            `The ${provider.title} provider is not configured to support sign-in`,
          );
        }
      }

      if (!identityResponse) {
        setShowLoginPage(true);
        return;
      }

      const profile = await authApi.getProfile();
      onSignInSuccess(
        UserIdentity.create({
          identity: identityResponse.identity,
          authApi,
          profile,
        }),
      );
    } catch (err: any) {
      // User closed the sign-in modal
      setError(err);
      setShowLoginPage(true);
    }
  };

  useMountEffect(() => {
    if (errorParam) {
      setError(new Error(errorParam));
    }
    login({ checkExisting: true });
  });

  return showLoginPage ? (
    <Page themeId="home">
      <Header title={configApi.getString('app.title')} />
      <Content>
        <Grid
          container
          justifyContent="center"
          spacing={2}
          component="ul"
          classes={classes}
        >
          <GridItem>
            <InfoCard
              variant="fullHeight"
              title={provider.title}
              actions={
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    login({ showPopup: true });
                  }}
                >
                  {t('signIn.title')}
                </Button>
              }
            >
              <Typography variant="body1">{provider.message}</Typography>
              {error &&
                error.name !== 'PopupRejectedError' &&
                (ErrorComponent ? (
                  <ErrorComponent error={error} />
                ) : (
                  <Typography variant="body1" color="error">
                    {error.message}
                  </Typography>
                ))}
            </InfoCard>
          </GridItem>
        </Grid>
      </Content>
    </Page>
  ) : (
    <Progress />
  );
};

export function SignInPage(props: Props) {
  if ('provider' in props) {
    return <SingleSignInPage {...props} />;
  }

  return <MultiSignInPage {...props} />;
}
