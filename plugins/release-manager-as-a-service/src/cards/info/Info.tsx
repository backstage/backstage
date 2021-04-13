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
import { Link, Typography } from '@material-ui/core';

import { Differ } from '../../components/Differ';
import { InfoCardPlus } from '../../components/InfoCardPlus';
import {
  GhGetBranchResponse,
  GhGetReleaseResponse,
  Project,
} from '../../types/types';
import { useStyles } from '../../styles/styles';
import { TEST_IDS } from '../../test-helpers/test-ids';
import flowImage from './flow.png';

interface InfoCardProps {
  releaseBranch: GhGetBranchResponse | null;
  latestRelease: GhGetReleaseResponse | null;
  project: Project;
}

export const Info = ({
  releaseBranch,
  latestRelease,
  project,
}: InfoCardProps) => {
  const classes = useStyles();

  return (
    <InfoCardPlus>
      <div style={{ marginBottom: '1em' }} data-testid={TEST_IDS.info.info}>
        <Typography variant="h6">Terminology</Typography>

        <Typography>
          <strong>GitHub</strong>: The source control system where releases
          reside in a practical sense. Read more about GitHub releases{' '}
          <Link
            href="https://docs.github.com/en/free-pro-team@latest/github/administering-a-repository/managing-releases-in-a-repository"
            target="_blank"
          >
            here
          </Link>
          . Note that this plugin works just as well with GitHub Enterprise
          (GHE)
        </Typography>

        <Typography>
          <strong>Release Candidate</strong>: A GitHub <i>prerelease</i>{' '}
          intended primarily for internal testing
        </Typography>

        <Typography>
          <strong>Release Version</strong>: A GitHub release intended for end
          users
        </Typography>
      </div>

      <div style={{ marginBottom: '1em' }}>
        <Typography variant="h6">Flow</Typography>

        <Typography className={classes.paragraph}>
          RMaaS is built with a specific flow in mind. For example, it assumes
          your project is configured to react to tags prefixed with <b>rc</b> or{' '}
          <b>version</b>.
        </Typography>

        <Typography className={classes.paragraph}>
          Here's an overview of the flow:
        </Typography>

        <img alt="flow" src={flowImage} style={{ width: '100%' }} />
      </div>

      <div style={{ marginBottom: '1em' }}>
        <Typography variant="h6">Details</Typography>

        <Typography>
          Repository:{' '}
          <Differ
            icon="github"
            next={`${project.github.org}/${project.github.repo}`}
          />
        </Typography>

        {project.slack && (
          <Typography>
            Slack channel:{' '}
            <Differ
              icon="slack"
              next={
                project.slack.link ? (
                  <Link href={project.slack.link} target="_blank">
                    #{project.slack.channel}
                  </Link>
                ) : (
                  <>(#{project.slack.channel})</>
                )
              }
            />
          </Typography>
        )}

        <Typography>
          Versioning strategy:{' '}
          <Differ icon="versioning" next={project.versioningStrategy} />
        </Typography>

        <Typography>
          Latest release branch:{' '}
          <Differ icon="branch" next={releaseBranch?.name} />
        </Typography>

        <Typography>
          Latest release: <Differ icon="tag" next={latestRelease?.tag_name} />
        </Typography>
      </div>
    </InfoCardPlus>
  );
};
