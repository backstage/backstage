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
import { DateTime, DurationObject } from 'luxon';
import {
  Box,
  Collapse,
  IconButton,
  Link,
  makeStyles,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { getMappedReleases } from './helpers/getMappedReleases';
import { useGetCommit } from './hooks/useGetCommit';
import { CenteredCircularProgress } from '../../components/CenteredCircularProgress';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

interface RowProps {
  baseVersion: string;
  mappedRelease: ReturnType<typeof getMappedReleases>['releases']['0'];
}

export function Row({ baseVersion, mappedRelease }: RowProps) {
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell component="th" scope="row">
          <Link href={mappedRelease.htmlUrl} target="_blank">
            {baseVersion}
            {mappedRelease.versions.length === 0 ? ' (prerelease)' : ''}
          </Link>
        </TableCell>

        <TableCell>
          {mappedRelease.createdAt
            ? DateTime.fromISO(mappedRelease.createdAt)
                .setLocale('sv-SE')
                .toFormat('yyyy-MM-dd')
            : '-'}
        </TableCell>

        <TableCell>{mappedRelease.candidates.length}</TableCell>

        <TableCell>{Math.max(0, mappedRelease.versions.length - 1)}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <CollapsedEl mappedRelease={mappedRelease} />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function CollapsedEl({
  mappedRelease,
}: {
  mappedRelease: ReturnType<typeof getMappedReleases>['releases']['0'];
}) {
  const reversedCandidates = [...mappedRelease.candidates].reverse();

  const { commit: releaseCut } = useGetCommit({
    ref: reversedCandidates[0]?.sha,
  });
  const { commit: releaseComplete } = useGetCommit({
    ref: mappedRelease.versions[0]?.sha,
  });

  console.log('*** releaseCut > ', releaseCut.value); // eslint-disable-line no-console
  console.log('*** releaseComplete > ', releaseComplete.value); // eslint-disable-line no-console

  let diff = { days: -1 } as DurationObject;
  if (releaseCut.value?.createdAt && releaseComplete.value?.createdAt) {
    diff = DateTime.fromISO(releaseComplete.value.createdAt)
      .diff(DateTime.fromISO(releaseCut.value.createdAt), ['days', 'hours'])
      .toObject();
  }

  return (
    <Box
      margin={1}
      style={{
        display: 'flex',
        alignItems: 'stretch',
        paddingLeft: '20%',
        paddingRight: '20%',
      }}
    >
      <Box
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {mappedRelease.versions.length > 0 && (
          <Box margin={1} style={{ position: 'relative' }}>
            {mappedRelease.versions.map(version => (
              <React.Fragment key={version.tagName}>
                <Typography variant="body1">{version.tagName}</Typography>
              </React.Fragment>
            ))}
          </Box>
        )}

        {mappedRelease.versions.length > 0 && (
          <Box
            margin={1}
            style={{
              position: 'relative',
              transform: 'rotate(-45deg)',
              fontSize: 30,
            }}
          >
            {' 🚀 '}
          </Box>
        )}

        <Box margin={1} style={{ position: 'relative' }}>
          {mappedRelease.candidates.map(candidate => (
            <React.Fragment key={candidate.tagName}>
              <Typography variant="body1">{candidate.tagName}</Typography>
            </React.Fragment>
          ))}
        </Box>
      </Box>

      <Box
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {releaseComplete.loading ? (
          <CenteredCircularProgress />
        ) : (
          <>
            <Box
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              Release completed{' '}
              {releaseComplete.value?.createdAt &&
                DateTime.fromISO(releaseComplete.value.createdAt)
                  .setLocale('sv-SE')
                  .toFormat('yyyy-MM-dd')}
            </Box>

            <Box
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant="h4">
                Release time: {diff.days} days
              </Typography>
            </Box>

            <Box
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              RC created{' '}
              {releaseCut.value?.createdAt &&
                DateTime.fromISO(releaseCut.value.createdAt)
                  .setLocale('sv-SE')
                  .toFormat('yyyy-MM-dd')}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
