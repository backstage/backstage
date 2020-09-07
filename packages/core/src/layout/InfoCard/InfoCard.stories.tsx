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
import { InfoCard } from '.';
import { Grid, Typography } from '@material-ui/core';

const linkInfo = { title: 'Go to XYZ Location', link: '#' };

export default {
  title: 'Information Card',
  component: InfoCard,
};

const text = (
  <Typography paragraph>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </Typography>
);

const Wrapper: FC<{}> = ({ children }) => (
  <Grid container spacing={4}>
    <Grid item xs={4}>
      {children}
    </Grid>
  </Grid>
);

export const Default = () => (
  <Wrapper>
    <InfoCard title="Information Card">{text}</InfoCard>
  </Wrapper>
);

export const Subhead = () => (
  <Wrapper>
    <InfoCard title="Information Card" subheader="Subheader">
      {text}
    </InfoCard>
  </Wrapper>
);

export const LinkInFooter = () => (
  <Wrapper>
    <InfoCard title="Information Card" deepLink={linkInfo}>
      {text}
    </InfoCard>
  </Wrapper>
);
