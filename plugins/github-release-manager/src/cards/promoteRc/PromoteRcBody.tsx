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
import { Button, Typography } from '@material-ui/core';

import { ComponentConfigPromoteRc } from '../../types/types';
import { Dialog } from '../../components/Dialog';
import { Differ } from '../../components/Differ';
import { GetLatestReleaseResult } from '../../api/PluginApiClient';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { usePluginApiClientContext } from '../../contexts/PluginApiClientContext';
import { useProjectContext } from '../../contexts/ProjectContext';
import { usePromoteRc } from './sideEffects/usePromoteRc';
import { useStyles } from '../../styles/styles';

interface PromoteRcBodyProps {
  rcRelease: NonNullable<GetLatestReleaseResult>;
  successCb?: ComponentConfigPromoteRc['successCb'];
}

export const PromoteRcBody = ({ rcRelease, successCb }: PromoteRcBodyProps) => {
  const pluginApiClient = usePluginApiClientContext();
  const project = useProjectContext();
  const classes = useStyles();
  const releaseVersion = rcRelease.tagName.replace('rc-', 'version-');

  const { run, responseSteps, progress } = usePromoteRc({
    pluginApiClient,
    project,
    rcRelease,
    releaseVersion,
    successCb,
  });

  if (responseSteps.length > 0) {
    return (
      <Dialog
        progress={progress}
        responseSteps={responseSteps}
        title="Promote Release Candidate"
      />
    );
  }

  return (
    <>
      <Typography className={classes.paragraph}>
        Promotes the current Release Candidate to a <b>Release Version</b>.
      </Typography>

      <Typography className={classes.paragraph}>
        <Differ icon="tag" current={rcRelease.tagName} next={releaseVersion} />
      </Typography>

      <Button
        data-testid={TEST_IDS.promoteRc.cta}
        variant="contained"
        color="primary"
        onClick={() => run()}
      >
        Promote Release Candidate
      </Button>
    </>
  );
};
