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

import { getBumpedTag } from '../../helpers/getBumpedTag';
import { InfoCardPlus } from '../../components/InfoCardPlus';
import { NoLatestRelease } from '../../components/NoLatestRelease';
import {
  ComponentConfigPatch,
  GhGetBranchResponse,
  GhGetReleaseResponse,
  SetRefetch,
} from '../../types/types';
import { PatchBody } from './PatchBody';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useStyles } from '../../styles/styles';

interface PatchProps {
  latestRelease: GhGetReleaseResponse | null;
  releaseBranch: GhGetBranchResponse | null;
  setRefetch: SetRefetch;
  successCb?: ComponentConfigPatch['successCb'];
}

export const Patch = ({
  latestRelease,
  releaseBranch,
  setRefetch,
  successCb,
}: PatchProps) => {
  const project = useProjectContext();
  const classes = useStyles();

  function Body() {
    if (latestRelease === null) {
      return <NoLatestRelease />;
    }

    const { bumpedTag, tagParts } = getBumpedTag({
      project,
      tag: latestRelease.tag_name,
      bumpLevel: 'patch',
    });

    return (
      <PatchBody
        bumpedTag={bumpedTag}
        latestRelease={latestRelease}
        releaseBranch={releaseBranch}
        setRefetch={setRefetch}
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
