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
import { Typography } from '@material-ui/core';

import { ApiMethodRetval, IPluginApiClient } from '../../api/PluginApiClient';
import { ComponentConfigPatch } from '../../types/types';
import { getBumpedTag } from '../../helpers/getBumpedTag';
import { InfoCardPlus } from '../../components/InfoCardPlus';
import { NoLatestRelease } from '../../components/NoLatestRelease';
import { PatchBody } from './PatchBody';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useStyles } from '../../styles/styles';

interface PatchProps {
  latestRelease: ApiMethodRetval<
    IPluginApiClient['getLatestRelease']
  >['latestRelease'];
  releaseBranch: ApiMethodRetval<IPluginApiClient['getBranch']> | null;
  successCb?: ComponentConfigPatch['successCb'];
}

export const Patch = ({
  latestRelease,
  releaseBranch,
  successCb,
}: PatchProps) => {
  const project = useProjectContext();
  const classes = useStyles();

  function Body() {
    if (latestRelease === null) {
      return <NoLatestRelease />;
    }

    if (releaseBranch === null) {
      return <NoLatestRelease />;
    }

    const { bumpedTag, tagParts } = getBumpedTag({
      project,
      tag: latestRelease.tagName,
      bumpLevel: 'patch',
    });

    return (
      <PatchBody
        bumpedTag={bumpedTag}
        latestRelease={latestRelease}
        releaseBranch={releaseBranch}
        successCb={successCb}
        tagParts={tagParts}
      />
    );
  }

  return (
    <InfoCardPlus>
      <Typography variant="h4" className={classes.paragraph}>
        Patch Release {latestRelease?.prerelease ? 'Candidate' : 'Version'}
      </Typography>

      <Body />
    </InfoCardPlus>
  );
};
