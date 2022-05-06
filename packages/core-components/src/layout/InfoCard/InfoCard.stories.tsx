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

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React, { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router';
import { InfoCard, Props } from './InfoCard';

export default {
  title: 'Layout/Information Card',
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

const defaultProps = {
  title: 'Information Card',
  subheader: 'Subheader',
};

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <MemoryRouter>
    <Grid container spacing={4}>
      <Grid item xs={4}>
        {children}
      </Grid>
    </Grid>
  </MemoryRouter>
);

export const Default = (args: Props) => (
  <Wrapper>
    <InfoCard {...args}>{text}</InfoCard>
  </Wrapper>
);

Default.args = defaultProps;

export const LinkInFooter = (args: Props) => (
  <Wrapper>
    <InfoCard {...args}>{text}</InfoCard>
  </Wrapper>
);

LinkInFooter.args = {
  ...defaultProps,
  deepLink: { title: 'Go to XYZ Location', link: '#' },
};
