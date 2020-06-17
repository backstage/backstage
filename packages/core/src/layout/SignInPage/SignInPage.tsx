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
import { Page } from '../Page';
import { Header } from '../Header';
import { Content } from '../Content/Content';
import { ContentHeader } from '../ContentHeader/ContentHeader';
import { Grid } from '@material-ui/core';
import { SignInPageProps, useApi, configApiRef } from '@backstage/core-api';
import { useSignInProviders, SignInProviderId } from './providers';
import Progress from '../../components/Progress';

export type Props = SignInPageProps & {
  providers: SignInProviderId[];
};

export const SignInPage: FC<Props> = ({ onResult, providers }) => {
  const configApi = useApi(configApiRef);

  const [loading, providerElements] = useSignInProviders(providers, onResult);

  if (loading) {
    return <Progress />;
  }

  return (
    <Page>
      <Header title={configApi.getString('app.title') ?? 'Backstage'} />
      <Content>
        <ContentHeader title="Select a sign-in method" />
        <Grid container>{providerElements}</Grid>
      </Content>
    </Page>
  );
};
