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
import { Alert } from '@material-ui/lab';
import { Button, Typography } from '@material-ui/core';
import { useAsyncFn } from 'react-use';

import { Differ } from '../../components/Differ';
import {
  ComponentConfigPromoteRc,
  GhGetReleaseResponse,
  SetRefetch,
} from '../../types/types';
import { promoteRc } from './sideEffects/promoteRc';
import { ResponseStepList } from '../../components/ResponseStepList/ResponseStepList';
import { useApiClientContext } from '../../components/ProjectContext';
import { useStyles } from '../../styles/styles';
import { TEST_IDS } from '../../test-helpers/test-ids';

interface PromoteRcBodyProps {
  rcRelease: GhGetReleaseResponse;
  setRefetch: SetRefetch;
  successCb?: ComponentConfigPromoteRc['successCb'];
}

export const PromoteRcBody = ({
  rcRelease,
  setRefetch,
  successCb,
}: PromoteRcBodyProps) => {
  const apiClient = useApiClientContext();
  const classes = useStyles();
  const releaseVersion = rcRelease.tag_name.replace('rc-', 'version-');
  const [promoteGitHubRcResponse, promoseGitHubRcFn] = useAsyncFn(
    promoteRc({ apiClient, rcRelease, releaseVersion, successCb }),
  );

  if (promoteGitHubRcResponse.error) {
    return (
      <Alert severity="error">{promoteGitHubRcResponse.error.message}</Alert>
    );
  }

  function Description() {
    return (
      <>
        <Typography className={classes.paragraph}>
          Promotes the current Release Candidate to a <b>Release Version</b>.
        </Typography>

        <Typography className={classes.paragraph}>
          <Differ icon="tag" prev={rcRelease.tag_name} next={releaseVersion} />
        </Typography>
      </>
    );
  }

  function CTA() {
    if (promoteGitHubRcResponse.loading || promoteGitHubRcResponse.value) {
      return (
        <ResponseStepList
          responseSteps={promoteGitHubRcResponse.value}
          title="Promote RC result"
          setRefetch={setRefetch}
          loading={promoteGitHubRcResponse.loading}
        />
      );
    }

    return (
      <Button
        data-testid={TEST_IDS.promoteRc.cta}
        variant="contained"
        color="primary"
        onClick={() => promoseGitHubRcFn()}
      >
        Promote Release Candidate
      </Button>
    );
  }

  return (
    <div>
      <Description />

      <CTA />
    </div>
  );
};
