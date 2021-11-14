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
import { useApi } from '@backstage/core-plugin-api';
import { Content, Page, InfoCard } from '@backstage/core-components';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { scorecardsApiRef } from '../../api/ScorecardsApi';

const useStyles = makeStyles(() => ({
  contentScorecards: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  subheader: {
    fontWeight: 'bold',
  },
}));

type Checks = {
  checks: CheckResult[];
};

export const ChecksOverview = ({ checks }: Checks) => {
  const classes = useStyles();
  const api = useApi(scorecardsApiRef);
  const checkRenderType = api.getScorecardsDefinition(
    checks[0].check.type,
    checks,
  );

  if (checkRenderType) {
    return (
      <Page themeId="home">
        <Content className={classes.contentScorecards}>
          <Grid item xs={12}>
            <InfoCard title={checkRenderType.title}>
              <Typography className={classes.subheader} variant="body1">
                {checkRenderType.description}
              </Typography>
              <Grid item xs={11}>
                {checkRenderType.component}
              </Grid>
            </InfoCard>
          </Grid>
        </Content>
      </Page>
    );
  }

  return <></>;
};
