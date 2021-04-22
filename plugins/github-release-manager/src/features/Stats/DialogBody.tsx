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
import {
  Box,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';

import { CenteredCircularProgress } from '../../components/CenteredCircularProgress';
import { getMappedReleases } from './getMappedReleases';
import { getSummary } from './getSummary';
import { getTags } from './getTags';
import { Row } from './Row';
import { useGetStats } from './hooks/useGetStats';
import { useProjectContext } from '../../contexts/ProjectContext';
import { Warn } from './Warn';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export function DialogBody() {
  const classes = useStyles();
  const { stats } = useGetStats();
  const { project } = useProjectContext();

  if (stats.error) {
    return (
      <Alert severity="error">Unexpected error: {stats.error.message}</Alert>
    );
  }

  if (stats.loading) {
    return <CenteredCircularProgress />;
  }

  if (!stats.value) {
    return <Alert severity="error">Couldn't find any stats :(</Alert>;
  }

  const { allReleases, allTags } = stats.value;
  const mappedReleases = getMappedReleases({ allReleases, project });
  const tags = getTags({ allTags, project, mappedReleases });
  const summary = getSummary({ mappedReleases });
  const shouldWarn =
    tags.unmappable.length > 0 ||
    tags.unmatched.length > 0 ||
    mappedReleases.unmatched.length > 0;

  if (shouldWarn) {
    // eslint-disable-next-line no-console
    console.log("⚠️ Here's a summary of unmapped/unmatched tags/releases", {
      unmappableTags: tags.unmappable,
      unmatchableTags: tags.unmatched,
      unmatchableReleases: mappedReleases.unmatched,
    });
  }

  const getDecimalNumber = (n: number) => {
    if (isNaN(n)) {
      return 0;
    }

    if (n.toString().includes('.')) {
      return n.toFixed(2);
    }

    return n;
  };

  return (
    <>
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
            Patches:{' '}
            {summary.totalCandidatePatches + summary.totalVersionPatches}
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

      <TableContainer component={Paper}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Release</TableCell>
              <TableCell>Created at</TableCell>
              <TableCell># candidate patches</TableCell>
              <TableCell># release patches</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Object.entries(mappedReleases.releases).map(
              ([baseVersion, mappedRelease], index) => {
                return (
                  <Row
                    key={`row-${index}`}
                    baseVersion={baseVersion}
                    mappedRelease={mappedRelease}
                  />
                );
              },
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box marginTop={2}>
        {shouldWarn && (
          <Warn tags={tags} mappedReleases={mappedReleases} project={project} />
        )}
      </Box>
    </>
  );
}
