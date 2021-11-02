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

import React from 'react';
import { makeStyles, Grid, Typography } from '@material-ui/core';
import { Content, Page, InfoCard } from '@backstage/core-components';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { BackstageTheme } from '@backstage/theme';
import { BooleanCheck } from '../BooleanCheck';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  listItem: {
    display: 'flex',
    paddingLeft: '0',
    flexWrap: 'wrap',
  },
  listItemText: {
    paddingRight: '1rem',
    flex: '0 1 auto',
  },
  contentScorecards: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  details: {
    width: '100%',
    padding: '1rem',
    backgroundColor: theme.palette.background.default,
  },
  icon: {
    marginLeft: 'auto',
  },
}));

type Checks = {
  checks: CheckResult[];
};

export const ChecksOverview = ({ checks }: Checks) => {
  const classes = useStyles();
  return (
    <Page themeId="home">
      <Content className={classes.contentScorecards}>
        <Grid container direction="row">
          <Grid item xs={12}>
            <InfoCard>
              <Grid container direction="row">
                <Grid item>
                  <Typography variant="h6">Check name</Typography>
                </Grid>
              </Grid>
              <Grid container direction="row">
                <Grid item xs={9}>
                  {checks!.map(
                    (checkResult, index) =>
                      checkResult.check.type === 'json-rules-engine' && (
                        <BooleanCheck key={index} checkResult={checkResult} />
                      ),
                  )}
                </Grid>
              </Grid>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
