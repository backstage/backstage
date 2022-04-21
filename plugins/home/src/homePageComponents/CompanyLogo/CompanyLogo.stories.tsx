/*
 * Copyright 2021 The Backstage Authors
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

import { TemplateBackstageLogo } from '../../assets';
import { HomePageCompanyLogo } from '../../plugin';
import { rootRouteRef } from '../../routes';
import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';
import { configApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/core-app-api';
import { Grid, makeStyles } from '@material-ui/core';
import React, { ComponentType } from 'react';

export default {
  title: 'Plugins/Home/Components/CompanyLogo',
  decorators: [
    (Story: ComponentType<{}>) =>
      wrapInTestApp(
        <TestApiProvider
          apis={[
            [configApiRef, new ConfigReader({ app: { title: 'My App' } })],
          ]}
        >
          <Story />
        </TestApiProvider>,
        {
          mountedRoutes: { '/hello-company-logo': rootRouteRef },
        },
      ),
  ],
};

const useLogoStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(5, 0),
  },
  svg: {
    width: 'auto',
    height: 100,
  },
  path: {
    fill: '#7df3e1',
  },
}));

export const Default = () => {
  const { container } = useLogoStyles();

  return (
    <Grid container justifyContent="center" spacing={6}>
      <HomePageCompanyLogo className={container} />
    </Grid>
  );
};

export const CustomLogo = () => {
  const { container, svg, path } = useLogoStyles();

  return (
    <Grid container justifyContent="center" spacing={6}>
      <HomePageCompanyLogo
        className={container}
        logo={<TemplateBackstageLogo classes={{ svg, path }} />}
      />
    </Grid>
  );
};
