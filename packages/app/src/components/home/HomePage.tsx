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

import {
  ClockConfig,
  CustomHomepageGrid,
  HeaderWorldClock,
  HomePageCompanyLogo,
  HomePageRandomJoke,
  HomePageStarredEntities,
  HomePageToolkit,
  HomePageTopVisited,
  HomePageRecentlyVisited,
  WelcomeTitle,
} from '@backstage/plugin-home';
import { Content, Header, Page } from '@backstage/core-components';
import { HomePageSearchBar } from '@backstage/plugin-search';
import { HomePageCalendar } from '@backstage/plugin-gcalendar';
import { MicrosoftCalendarCard } from '@backstage/plugin-microsoft-calendar';
import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import { HomePagePagerDutyCard } from '@backstage/plugin-pagerduty';

const clockConfigs: ClockConfig[] = [
  {
    label: 'NYC',
    timeZone: 'America/New_York',
  },
  {
    label: 'UTC',
    timeZone: 'UTC',
  },
  {
    label: 'STO',
    timeZone: 'Europe/Stockholm',
  },
  {
    label: 'TYO',
    timeZone: 'Asia/Tokyo',
  },
];

const timeFormat: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
};

const defaultConfig = [
  {
    component: 'CompanyLogo',
    x: 0,
    y: 0,
    width: 12,
    height: 1,
    movable: false,
    resizable: false,
    deletable: false,
  },
  {
    component: 'WelcomeTitle',
    x: 0,
    y: 1,
    width: 12,
    height: 1,
  },
  {
    component: 'HomePageSearchBar',
    x: 0,
    y: 2,
    width: 12,
    height: 2,
  },
];

export const homePage = (
  <Page themeId="home">
    <Header title={<WelcomeTitle />} pageTitleOverride="Home">
      <HeaderWorldClock
        clockConfigs={clockConfigs}
        customTimeFormat={timeFormat}
      />
    </Header>
    <Content>
      <CustomHomepageGrid config={defaultConfig}>
        <HomePageSearchBar />
        <HomePageRandomJoke />
        <HomePageCalendar />
        <HomePagePagerDutyCard name="Rota" />
        <MicrosoftCalendarCard />
        <HomePageStarredEntities />
        <HomePageCompanyLogo />
        <WelcomeTitle />
        <HomePageToolkit
          tools={[
            {
              url: 'https://backstage.io',
              label: 'Backstage Homepage',
              icon: <HomeIcon />,
            },
          ]}
        />
        <HomePageTopVisited />
        <HomePageRecentlyVisited />
      </CustomHomepageGrid>
    </Content>
  </Page>
);
