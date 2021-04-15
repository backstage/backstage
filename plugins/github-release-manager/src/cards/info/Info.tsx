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
import { GhGetBranchResponse } from '../../types/types';
import { InfoCardPlus } from '../../components/InfoCardPlus';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useStyles } from '../../styles/styles';
import flowImage from './flow.png';
import { ApiMethodRetval, IPluginApiClient } from '../../api/PluginApiClient';

interface InfoCardProps {
  releaseBranch: GhGetBranchResponse | null;
  latestRelease: ApiMethodRetval<
    IPluginApiClient['getLatestRelease']
  >['latestRelease'];
}

export const Info = ({ releaseBranch, latestRelease }: InfoCardProps) => {
  const project = useProjectContext();

  const classes = useStyles();

  return (
    <InfoCardPlus>
      <div style={{ marginBottom: '1em' }} data-testid={TEST_IDS.info.info}>
        <Typography variant="h6">Terminology</Typography>

        <Typography>
          <strong>GitHub</strong>: The source control system where releases
          reside in a practical sense. Read more about{' '}
          <Link
            href="https://docs.github.com/en/github/administering-a-repository/managing-releases-in-a-repository"
            target="_blank"
          >
            GitHub releases
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
          GitHub Release Manager is built with a specific flow in mind. For
          example, it assumes your project is configured to react to tags
          prefixed with <b>rc</b> or <b>version</b>.
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
          <Differ icon="github" next={`${project.owner}/${project.repo}`} />
        </Typography>

        <Typography>
          Versioning strategy:{' '}
          <Differ icon="versioning" next={project.versioningStrategy} />
        </Typography>

        <Typography>
          Latest release branch:{' '}
          <Differ icon="branch" next={releaseBranch?.name} />
        </Typography>

        <Typography>
          Latest release: <Differ icon="tag" next={latestRelease?.tagName} />
        </Typography>
      </div>
    </InfoCardPlus>
  );
};
