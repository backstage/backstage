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
import { Alert, AlertTitle } from '@material-ui/lab';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';

import {
  GetBranchResult,
  GetLatestReleaseResult,
  GetRepositoryResult,
} from '../../api/PluginApiClient';
import { ComponentConfigCreateRc } from '../../types/types';
import { Differ } from '../../components/Differ';
import { getRcGitHubInfo } from '../../helpers/getRcGitHubInfo';
import { InfoCardPlus } from '../../components/InfoCardPlus';
import { ResponseStepDialog } from '../../components/ResponseStepDialog/ResponseStepDialog';
import { SEMVER_PARTS } from '../../constants/constants';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { useCreateRc } from './hooks/useCreateRc';
import { usePluginApiClientContext } from '../../contexts/PluginApiClientContext';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useStyles } from '../../styles/styles';

interface CreateRcProps {
  defaultBranch: GetRepositoryResult['defaultBranch'];
  latestRelease: GetLatestReleaseResult;
  releaseBranch: GetBranchResult | null;
  successCb?: ComponentConfigCreateRc['successCb'];
}

const InfoCardPlusWrapper = ({ children }: { children: React.ReactNode }) => {
  const classes = useStyles();
  return (
    <InfoCardPlus>
      <Typography variant="h4" className={classes.paragraph}>
        Create Release Candidate
      </Typography>
      {children}
    </InfoCardPlus>
  );
};

export const CreateRc = ({
  defaultBranch,
  latestRelease,
  releaseBranch,
  successCb,
}: CreateRcProps) => {
  const { pluginApiClient } = usePluginApiClientContext();
  const { project } = useProjectContext();
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

  const { progress, responseSteps, run, runInvoked } = useCreateRc({
    defaultBranch,
    latestRelease,
    nextGitHubInfo,
    pluginApiClient,
    project,
    successCb,
  });
  if (responseSteps.length > 0) {
    return (
      <ResponseStepDialog
        progress={progress}
        responseSteps={responseSteps}
        title="Create Release Candidate"
      />
    );
  }

  if (nextGitHubInfo.error !== undefined) {
    return (
      <InfoCardPlusWrapper>
        <Alert severity="error">
          {nextGitHubInfo.error.title && (
            <AlertTitle>{nextGitHubInfo.error.title}</AlertTitle>
          )}

          {nextGitHubInfo.error.subtitle}
        </Alert>
      </InfoCardPlusWrapper>
    );
  }

  const tagAlreadyExists =
    latestRelease !== null &&
    latestRelease.tagName === nextGitHubInfo.rcReleaseTag;
  const conflictingPreRelease =
    latestRelease !== null && latestRelease.prerelease;

  return (
    <InfoCardPlusWrapper>
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

      {conflictingPreRelease || tagAlreadyExists ? (
        <>
          {conflictingPreRelease && (
            <Alert className={classes.paragraph} severity="warning">
              The most recent release is already a Release Candidate
            </Alert>
          )}

          {tagAlreadyExists && (
            <Alert className={classes.paragraph} severity="warning">
              There's already a tag named{' '}
              <strong>{nextGitHubInfo.rcReleaseTag}</strong>
            </Alert>
          )}
        </>
      ) : (
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
      )}

      <Button
        data-testid={TEST_IDS.createRc.cta}
        disabled={conflictingPreRelease || tagAlreadyExists || runInvoked}
        variant="contained"
        color="primary"
        onClick={() => run()}
      >
        Create Release Candidate
      </Button>
    </InfoCardPlusWrapper>
  );
};
