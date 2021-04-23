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
import { Box, Typography } from '@material-ui/core';
import { DateTime } from 'luxon';

import { CenteredCircularProgress } from '../../../../components/CenteredCircularProgress';
import { getReleasesWithTags } from '../../helpers/getReleasesWithTags';
import { useGetCommit } from '../../hooks/useGetCommit';
import { Alert } from '@material-ui/lab';

interface ReleaseTimeProps {
  releaseWithTags: ReturnType<
    typeof getReleasesWithTags
  >['releasesWithTags']['releases']['0'];
}

export function ReleaseTime({ releaseWithTags }: ReleaseTimeProps) {
  const reversedCandidates = [...releaseWithTags.candidates].reverse();

  const firstCandidateSha = reversedCandidates[0]?.sha;
  const { commit: releaseCut } = useGetCommit({ ref: firstCandidateSha });

  const mostRecentVersionSha = releaseWithTags.versions[0]?.sha;
  const { commit: releaseComplete } = useGetCommit({
    ref: mostRecentVersionSha,
  });

  if (releaseCut.loading || releaseComplete.loading) {
    return (
      <Wrapper>
        <CenteredCircularProgress />
      </Wrapper>
    );
  }

  if (releaseCut.error) {
    return (
      <Alert severity="error">
        Failed to fetch the first Release Candidate commit (
        {releaseCut.error.message})
      </Alert>
    );
  }

  if (releaseComplete.error) {
    return (
      <Alert severity="error">
        Failed to fetch the final Release Version Commit (
        {releaseComplete.error.message})
      </Alert>
    );
  }

  const diff =
    releaseCut.value?.createdAt && releaseComplete.value?.createdAt
      ? DateTime.fromISO(releaseComplete.value.createdAt)
          .diff(DateTime.fromISO(releaseCut.value.createdAt), ['days', 'hours'])
          .toObject()
      : { days: -1 };

  return (
    <Wrapper>
      <Box
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        <Typography variant="body1">
          Release completed{' '}
          {releaseComplete.value?.createdAt &&
            DateTime.fromISO(releaseComplete.value.createdAt)
              .setLocale('sv-SE')
              .toFormat('yyyy-MM-dd')}
        </Typography>
      </Box>

      <Box
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" color="secondary">
          Release time: {diff.days} days
        </Typography>
      </Box>

      <Box
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Typography variant="body1">
          Release Candidate created{' '}
          {releaseCut.value?.createdAt &&
            DateTime.fromISO(releaseCut.value.createdAt)
              .setLocale('sv-SE')
              .toFormat('yyyy-MM-dd')}
        </Typography>
      </Box>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Box
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </Box>
  );
}
