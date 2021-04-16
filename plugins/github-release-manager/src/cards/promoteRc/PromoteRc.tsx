/*
 * Copyright 2021 Spotify AB
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
import { Alert, AlertTitle } from '@material-ui/lab';
import { Typography } from '@material-ui/core';

import { InfoCardPlus } from '../../components/InfoCardPlus';
import { NoLatestRelease } from '../../components/NoLatestRelease';
import { ComponentConfigPromoteRc } from '../../types/types';
import { PromoteRcBody } from './PromoteRcBody';
import { useStyles } from '../../styles/styles';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { GetLatestReleaseResult } from '../../api/PluginApiClient';

interface PromoteRcProps {
  latestRelease: GetLatestReleaseResult;
  successCb?: ComponentConfigPromoteRc['successCb'];
}

export const PromoteRc = ({ latestRelease, successCb }: PromoteRcProps) => {
  const classes = useStyles();

  function Body() {
    if (latestRelease === null) {
      return <NoLatestRelease />;
    }

    if (!latestRelease.prerelease) {
      return (
        <Alert
          data-testid={TEST_IDS.promoteRc.notRcWarning}
          className={classes.paragraph}
          severity="warning"
        >
          <AlertTitle>
            Latest GitHub release is not a Release Candidate
          </AlertTitle>
          One can only promote Release Candidates to Release Versions
        </Alert>
      );
    }

    return <PromoteRcBody rcRelease={latestRelease} successCb={successCb} />;
  }

  return (
    <InfoCardPlus>
      <Typography variant="h4" className={classes.paragraph}>
        Promote Release Candidate
      </Typography>

      <Body />
    </InfoCardPlus>
  );
};
