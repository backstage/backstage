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

import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import {
  Content,
  ContentHeader,
  Page,
  Header,
  SupportButton,
} from '@backstage/core';
import RadarComponent from '../components/RadarComponent';
import { TechRadarComponentProps } from '../api';

const useStyles = makeStyles(() => ({
  overflowXScroll: {
    overflowX: 'scroll',
  },
}));

export type TechRadarPageProps = TechRadarComponentProps & {
  title?: string;
  subtitle?: string;
  pageTitle?: string;
};

export const RadarPage = ({
  title,
  subtitle,
  pageTitle,
  ...props
}: TechRadarPageProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Page themeId="tool">
      <Header title={title} subtitle={subtitle} />
      <Content className={classes.overflowXScroll}>
        <ContentHeader title={pageTitle}>
          <SupportButton>
            <div>
              <h3>What is the Tech Radar?</h3>
              <p>
                The DFDS Tech Radar is a list of technologies, complemented by
                an assessment result, called <em>ring assignment</em>. We use
                four rings with the following semantics:
              </p>
              <ul>
                <li>
                  <strong>ADOPT</strong> &mdash; Technologies we have high
                  confidence in to serve our purpose, also in large scale.
                  Technologies with a usage culture in our DFDS production
                  environment, low risk and recommended to be widely used.
                </li>
                <li>
                  <strong>TRIAL</strong> &mdash; Technologies that we have seen
                  work with success in project work to solve a real problem;
                  first serious usage experience that confirm benefits and can
                  uncover limitations. TRIAL technologies are slightly more
                  risky; some engineers in our organization walked this path and
                  will share knowledge and experiences.
                </li>
                <li>
                  <strong>ASSESS</strong> &mdash; Technologies that are
                  promising and have clear potential value-add for us;
                  technologies worth to invest some research and prototyping
                  efforts in to see if it has impact. ASSESS technologies have
                  higher risks; they are often brand new and highly unproven in
                  our organisation. You will find some engineers that have
                  knowledge in the technology and promote it, you may even find
                  teams that have started a prototyping effort.
                </li>
                <li>
                  <strong>HOLD</strong> &mdash; Technologies not recommended to
                  be used for new projects. Technologies that we think are not
                  (yet) worth to (further) invest in. HOLD technologies should
                  not be used for new projects, but usually can be continued for
                  existing projects.
                </li>
              </ul>

              <h3>What is the purpose?</h3>

              <p>
                The Tech Radar is a tool to inspire and support engineering
                teams at DFDS to pick the best technologies for new projects; it
                provides a platform to share knowledge and experience in
                technologies, to reflect on technology decisions and
                continuously evolve our technology landscape. Based on the{' '}
                <a href="https://www.thoughtworks.com/radar">
                  pioneering work of ThoughtWorks
                </a>
                , our Tech Radar sets out the changes in technologies that are
                interesting in software development &mdash; changes that we
                think our engineering teams should pay attention to and consider
                using in their projects.
              </p>

              <h3>How do we maintain it?</h3>

              <p>
                <em>
                  This was built on the Zalando Tech Radar. It is{' '}
                  <a href="https://github.com/zalando/tech-radar">
                    freely available as open source
                  </a>
                  . Many thanks to Zalando for making it available. BTW,
                  consider taking a look at it, you might be inspired.
                </em>
              </p>
            </div>
          </SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="row">
          <Grid item xs={12} sm={6} md={4}>
            <RadarComponent {...props} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

RadarPage.defaultProps = {
  title: 'Tech Radar',
  subtitle: 'Pick the recommended technologies for your projects',
  pageTitle: 'DFDS Tech Radar — 2021 Q3',
};
