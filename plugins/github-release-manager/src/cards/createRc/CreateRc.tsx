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

import React, { useState, useEffect } from 'react';
import { Alert } from '@material-ui/lab';
import {
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';

import { ComponentConfigCreateRc } from '../../types/types';
import { useCreateRc } from './sideEffects/useCreateRc';
import { Differ } from '../../components/Differ';
import { getRcGitHubInfo } from './getRcGitHubInfo';
import { InfoCardPlus } from '../../components/InfoCardPlus';
import { SEMVER_PARTS } from '../../constants/constants';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { usePluginApiClientContext } from '../../contexts/PluginApiClientContext';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useStyles } from '../../styles/styles';
import {
  GetBranchResult,
  GetLatestReleaseResult,
  GetRepositoryResult,
} from '../../api/PluginApiClient';
import { ResponseStepList2 } from '../../components/ResponseStepList/ResponseStepList2';
import { LinearProgressWithLabel } from '../../components/LinearProgressWithLabel';

interface CreateRcProps {
  defaultBranch: GetRepositoryResult['defaultBranch'];
  latestRelease: GetLatestReleaseResult;
  releaseBranch: GetBranchResult | null;
  successCb?: ComponentConfigCreateRc['successCb'];
}

export const CreateRc = ({
  defaultBranch,
  latestRelease,
  releaseBranch,
  successCb,
}: CreateRcProps) => {
  const pluginApiClient = usePluginApiClientContext();
  const project = useProjectContext();
  const classes = useStyles();

  const [semverBumpLevel, setSemverBumpLevel] = useState<'major' | 'minor'>(
    SEMVER_PARTS.minor,
  );
  const [nextGitHubInfo, setNextGitHubInfo] = useState(
    getRcGitHubInfo({ latestRelease, project, semverBumpLevel }),
  );

  useEffect(() => {
    setNextGitHubInfo(
      getRcGitHubInfo({ latestRelease, project, semverBumpLevel }),
    );
  }, [semverBumpLevel, setNextGitHubInfo, latestRelease, project]);

  const { run, responseSteps, progress } = useCreateRc({
    defaultBranch,
    latestRelease,
    nextGitHubInfo,
    pluginApiClient,
    project,
    successCb,
  });
  if (responseSteps.length > 0) {
    return (
      <Dialog open maxWidth="md" fullWidth>
        <DialogTitle>Create Release Candidate</DialogTitle>

        <LinearProgressWithLabel value={progress} />

        <ResponseStepList2 responseSteps={responseSteps} />
      </Dialog>
    );
  }

  const tagAlreadyExists =
    latestRelease !== null &&
    latestRelease.tagName === nextGitHubInfo.rcReleaseTag;
  const conflictingPreRelease =
    latestRelease !== null && latestRelease.prerelease;

  function Description() {
    if (conflictingPreRelease) {
      return (
        <Alert className={classes.paragraph} severity="warning">
          The most recent release is already a Release Candidate
        </Alert>
      );
    }

    if (tagAlreadyExists) {
      return (
        <Alert className={classes.paragraph} severity="warning">
          There's already a tag named{' '}
          <strong>{nextGitHubInfo.rcReleaseTag}</strong>
        </Alert>
      );
    }

    return (
      <div className={classes.paragraph}>
        <Typography>
          <Differ
            icon="branch"
            current={releaseBranch?.name}
            next={nextGitHubInfo.rcBranch}
          />
        </Typography>

        <Typography>
          <Differ
            icon="tag"
            current={latestRelease?.tagName}
            next={nextGitHubInfo.rcReleaseTag}
          />
        </Typography>
      </div>
    );
  }

  function CTA() {
    return (
      <Button
        data-testid={TEST_IDS.createRc.cta}
        disabled={conflictingPreRelease || tagAlreadyExists}
        variant="contained"
        color="primary"
        onClick={async () => {
          await run();
        }}
      >
        Create RC
      </Button>
    );
  }

  return (
    <InfoCardPlus>
      <Typography variant="h4" className={classes.paragraph}>
        Create Release Candidate
      </Typography>

      {project.versioningStrategy === 'semver' &&
        latestRelease &&
        !conflictingPreRelease && (
          <div
            className={classes.paragraph}
            data-testid={TEST_IDS.createRc.semverSelect}
          >
            <FormControl style={{ margin: 5, minWidth: 250 }}>
              <InputLabel>Select bump severity</InputLabel>

              <Select
                value={semverBumpLevel}
                onChange={({ target: { value: semverSeverity } }: any) => {
                  setSemverBumpLevel(semverSeverity);
                }}
              >
                <MenuItem value={SEMVER_PARTS.minor}>
                  {SEMVER_PARTS.minor}
                </MenuItem>
                <MenuItem value={SEMVER_PARTS.major}>
                  {SEMVER_PARTS.major}
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        )}

      <Description />

      <CTA />
    </InfoCardPlus>
  );
};
