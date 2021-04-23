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
} from '@material-ui/core';

import { CenteredCircularProgress } from '../../components/CenteredCircularProgress';
import { getMappedReleases } from './helpers/mapReleases';
import { getReleasesWithTags } from './helpers/getReleasesWithTags';
import { getSummary } from './helpers/getSummary';
import { Row } from './Row/Row';
import { Summary } from './Summary';
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
  const { mappedReleases } = getMappedReleases({ allReleases, project });
  const { releasesWithTags } = getReleasesWithTags({
    mappedReleases,
    allTags,
    project,
  });
  const summary = getSummary({ releasesWithTags });
  const shouldWarn =
    releasesWithTags.unmappableTags.length > 0 ||
    releasesWithTags.unmatchedTags.length > 0 ||
    releasesWithTags.unmatched.length > 0;

  if (shouldWarn) {
    // eslint-disable-next-line no-console
    console.log("⚠️ Here's a summary of unmapped/unmatched tags/releases", {
      unmappableTags: releasesWithTags.unmappableTags,
      unmatchedTags: releasesWithTags.unmatchedTags,
      unmatchedReleases: releasesWithTags.unmatched,
    });
  }

  return (
    <>
      <Summary summary={summary} />

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
            {Object.entries(releasesWithTags.releases).map(
              ([baseVersion, releaseWithTags], index) => {
                return (
                  <Row
                    key={`row-${index}`}
                    baseVersion={baseVersion}
                    releaseWithTags={releaseWithTags}
                  />
                );
              },
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box marginTop={2}>
        {shouldWarn && (
          <Warn releasesWithTags={releasesWithTags} project={project} />
        )}
      </Box>
    </>
  );
}
