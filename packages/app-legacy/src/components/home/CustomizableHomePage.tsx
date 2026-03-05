/*
 * Copyright 2025 The Backstage Authors
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
import { Page, Content } from '@backstage/core-components';
import {
  HomePageCompanyLogo,
  TemplateBackstageLogo,
  HomePageStarredEntities,
  HomePageToolkit,
  CustomHomepageGrid,
  HomePageRandomJoke,
  HomePageTopVisited,
  HomePageRecentlyVisited,
} from '@backstage/plugin-home';
import { HomePageSearchBar } from '@backstage/plugin-search';
import Grid from '@material-ui/core/Grid';

import { tools, useLogoStyles } from './shared';
import { WelcomeTitle } from '@backstage/plugin-home';

const defaultConfig = [
  {
    component: 'HomePageSearchBar',
    x: 0,
    y: 0,
    width: 24,
    height: 2,
    deletable: false,
  },
  {
    component: 'HomePageRecentlyVisited',
    x: 0,
    y: 1,
    width: 5,
    height: 4,
  },
  {
    component: 'HomePageTopVisited',
    x: 5,
    y: 1,
    width: 5,
    height: 4,
  },
  {
    component: 'HomePageStarredEntities',
    x: 0,
    y: 2,
    width: 6,
    height: 4,
  },
  {
    component: 'HomePageToolkit',
    x: 6,
    y: 6,
    width: 4,
    height: 4,
  },
];

export const CustomizableHomePage = () => {
  const { svg, path, container } = useLogoStyles();

  return (
    <Page themeId="home">
      <Content>
        <Grid container justifyContent="center">
          <HomePageCompanyLogo
            className={container}
            logo={<TemplateBackstageLogo classes={{ svg, path }} />}
          />
        </Grid>

        <CustomHomepageGrid config={defaultConfig}>
          <WelcomeTitle variant="h1" />
          <HomePageSearchBar />
          <HomePageRecentlyVisited />
          <HomePageTopVisited />
          <HomePageToolkit tools={tools} />
          <HomePageStarredEntities />
          <HomePageRandomJoke />
        </CustomHomepageGrid>
      </Content>
    </Page>
  );
};
