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

import React, { useState } from 'react';
import { useAsync } from 'react-use';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
  Button,
  Checkbox,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import {
  GetBranchResult,
  GetLatestReleaseResult,
} from '../../api/PluginApiClient';
import { CalverTagParts } from '../../helpers/tagParts/getCalverTagParts';
import { CenteredCircularProgress } from '../../components/CenteredCircularProgress';
import { ComponentConfigPatch } from '../../types/types';
import { Differ } from '../../components/Differ';
import { GitHubReleaseManagerError } from '../../errors/GitHubReleaseManagerError';
import { ResponseStepDialog } from '../../components/ResponseStepDialog/ResponseStepDialog';
import { SemverTagParts } from '../../helpers/tagParts/getSemverTagParts';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { usePatch } from './hooks/usePatch';
import { usePluginApiClientContext } from '../../contexts/PluginApiClientContext';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useStyles } from '../../styles/styles';

interface PatchBodyProps {
  bumpedTag: string;
  latestRelease: NonNullable<GetLatestReleaseResult>;
  releaseBranch: GetBranchResult;
  successCb?: ComponentConfigPatch['successCb'];
  tagParts: NonNullable<CalverTagParts | SemverTagParts>;
}

export const PatchBody = ({
  bumpedTag,
  latestRelease,
  releaseBranch,
  successCb,
  tagParts,
}: PatchBodyProps) => {
  const { pluginApiClient } = usePluginApiClientContext();
  const { project } = useProjectContext();
  const [checkedCommitIndex, setCheckedCommitIndex] = useState(-1);

  const githubDataResponse = useAsync(async () => {
    const [
      recentCommitsOnDefaultBranch,
      recentCommitsOnReleaseBranch,
    ] = await Promise.all([
      pluginApiClient.getRecentCommits({
        owner: project.owner,
        repo: project.repo,
      }),
      pluginApiClient.getRecentCommits({
        owner: project.owner,
        repo: project.repo,
        releaseBranchName: releaseBranch.name,
      }),
    ]);

    return {
      recentCommitsOnReleaseBranch,
      recentCommitsOnDefaultBranch,
    };
  });

  const { progress, responseSteps, run, runInvoked } = usePatch({
    bumpedTag,
    latestRelease,
    project,
    tagParts,
    successCb,
  });
  if (responseSteps.length > 0) {
    return (
      <ResponseStepDialog
        progress={progress}
        responseSteps={responseSteps}
        title="Patch Release Candidate"
      />
    );
  }

  if (githubDataResponse.error) {
    return (
      <Alert data-testid={TEST_IDS.patch.error} severity="error">
        Unexpected error: {githubDataResponse.error.message}
      </Alert>
    );
  }

  if (githubDataResponse.loading) {
    return <CenteredCircularProgress data-testid={TEST_IDS.patch.loading} />;
  }

  function Description() {
    const classes = useStyles();

    return (
      <>
        {!latestRelease.prerelease && (
          <Alert
            data-testid={TEST_IDS.patch.notPrerelease}
            className={classes.paragraph}
            severity="info"
          >
            <AlertTitle>
              The current GitHub release is a <b>Release Version</b>
            </AlertTitle>
            It's still possible to patch it, but be extra mindful of changes
          </Alert>
        )}

        <Typography className={classes.paragraph}>
          <Differ icon="tag" current={latestRelease.tagName} next={bumpedTag} />
        </Typography>
      </>
    );
  }

  function CommitList() {
    if (!githubDataResponse.value?.recentCommitsOnDefaultBranch) {
      return null;
    }

    return (
      <List>
        {githubDataResponse.value.recentCommitsOnDefaultBranch.map(
          (commit, index) => {
            // FIXME: Performance improvement opportunity: Convert to object lookup
            const commitExistsOnReleaseBranch = !!githubDataResponse.value?.recentCommitsOnReleaseBranch.find(
              releaseBranchCommit =>
                releaseBranchCommit.sha === commit.sha ||
                releaseBranchCommit.commit.message.includes(commit.sha), // The selected patch commit's sha is included in the commit message
            );
            const hasNoParent = !commit.firstParentSha;

            return (
              <div style={{ position: 'relative' }} key={`commit-${index}`}>
                {commitExistsOnReleaseBranch && (
                  <Paper
                    elevation={3}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate3d(-50%,-50%,0)',
                      zIndex: 10,
                      color: 'green',
                      padding: 6,
                      background: 'rgba(244,244,244,1)',
                      borderRadius: 8,
                    }}
                  >
                    <FileCopyIcon
                      fontSize="small"
                      style={{ verticalAlign: 'middle' }}
                    />{' '}
                    Already exists on <b>{releaseBranch?.name}</b>
                  </Paper>
                )}

                <ListItem
                  disabled={
                    runInvoked || commitExistsOnReleaseBranch || hasNoParent
                  }
                  role={undefined}
                  dense
                  button
                  onClick={() => {
                    if (index === checkedCommitIndex) {
                      setCheckedCommitIndex(-1);
                    } else {
                      setCheckedCommitIndex(index);
                    }
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checkedCommitIndex === index}
                      tabIndex={-1}
                    />
                  </ListItemIcon>

                  <ListItemText
                    style={{ marginRight: 15 }}
                    id={commit.sha}
                    primary={commit.commit.message}
                    secondary={
                      <>
                        <Link
                          color="primary"
                          href={commit.htmlUrl}
                          target="_blank"
                        >
                          {commit.sha}
                        </Link>{' '}
                        <Link
                          color="primary"
                          href={commit.author.htmlUrl}
                          target="_blank"
                        >
                          @{commit.author.login}
                        </Link>
                      </>
                    }
                  />

                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label="commit"
                      disabled={
                        runInvoked ||
                        commitExistsOnReleaseBranch ||
                        !releaseBranch
                      }
                      onClick={() => {
                        const repoPath = pluginApiClient.getRepoPath({
                          owner: project.owner,
                          repo: project.repo,
                        });
                        const host = pluginApiClient.getHost();

                        const newTab = window.open(
                          `https://${host}/${repoPath}/compare/${releaseBranch?.name}...${commit.sha}`,
                          '_blank',
                        );
                        newTab?.focus();
                      }}
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </div>
            );
          },
        )}
      </List>
    );
  }

  function CTA() {
    return (
      <Button
        disabled={checkedCommitIndex === -1 || progress > 0}
        variant="contained"
        color="primary"
        onClick={() => {
          const selectedPatchCommit =
            githubDataResponse.value?.recentCommitsOnDefaultBranch[
              checkedCommitIndex
            ];
          if (!selectedPatchCommit) {
            throw new GitHubReleaseManagerError(
              'Could not find selected patch commit',
            );
          }

          run(selectedPatchCommit);
        }}
      >
        Patch Release Candidate
      </Button>
    );
  }

  return (
    <div data-testid={TEST_IDS.patch.body}>
      <Description />

      <CommitList />

      <CTA />
    </div>
  );
};
