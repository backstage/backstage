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

import React, { FC, useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import {
  InfoCard,
  Page,
  pageTheme,
  Content,
  ContentHeader,
  SupportButton,
  useApi,
} from '@backstage/core';
import RegisterComponentForm from '../RegisterComponentForm';
import { catalogApiRef } from '@backstage/plugin-catalog';

const RegisterComponentPage: FC<{}> = () => {
  const catalogApi = useApi(catalogApiRef);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (formData: { componentIdInput: string }) => {
    setIsSubmitting(true);

    const { componentIdInput: target } = formData;

    const location = await catalogApi.addLocation('github', target);

    setIsSubmitting(false);
  };

  return (
    <Page theme={pageTheme.tool}>
      <Content>
        <ContentHeader title="Register Component">
          <SupportButton>Documentation</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard title="Start tracking your component in Backstage">
              <RegisterComponentForm
                onSubmit={onSubmit}
                submitting={isSubmitting}
              />
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export default RegisterComponentPage;
