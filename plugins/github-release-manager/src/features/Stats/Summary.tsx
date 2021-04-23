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
import { Box, Paper, Typography } from '@material-ui/core';

import { getDecimalNumber } from './helpers/getDecimalNumber';
import { getSummary } from './helpers/getSummary';

interface SummaryProps {
  summary: ReturnType<typeof getSummary>;
}

export function Summary({ summary }: SummaryProps) {
  return (
    <Paper
      variant="outlined"
      style={{
        padding: 20,
        marginLeft: 25,
        marginRight: 25,
        marginBottom: 25,
      }}
    >
      <Box margin={1}>
        <Typography variant="h4">Summary</Typography>
        <Typography variant="body2">
          Total releases: {summary.totalReleases}
        </Typography>
      </Box>

      <Box margin={1}>
        <Typography variant="h6">Release Candidate</Typography>
        <Typography variant="body2">
          Release Candidate patches: {summary.totalCandidatePatches}
        </Typography>

        <Typography variant="body2">
          Release Candidate patches per release:{' '}
          {getDecimalNumber(
            summary.totalCandidatePatches / summary.totalReleases,
          )}
        </Typography>
      </Box>

      <Box margin={1}>
        <Typography variant="h6">Release Version</Typography>
        <Typography variant="body2">
          Release Version patches: {summary.totalVersionPatches}
        </Typography>

        <Typography variant="body2">
          Release Version patches per release:{' '}
          {getDecimalNumber(
            summary.totalVersionPatches / summary.totalReleases,
          )}
        </Typography>
      </Box>

      <Box margin={1}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="body2">
          Patches: {summary.totalCandidatePatches + summary.totalVersionPatches}
        </Typography>

        <Typography variant="body2">
          Patches per release:{' '}
          {getDecimalNumber(
            (summary.totalCandidatePatches + summary.totalVersionPatches) /
              summary.totalReleases,
          )}
        </Typography>
      </Box>
    </Paper>
  );
}
