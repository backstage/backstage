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
import { DateTime } from 'luxon';
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

import { getMappedReleases } from './getMappedReleases';

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
  const versions = mappedRelease.versions.reverse();
  const candidates = mappedRelease.candidates.reverse();
  const isPrerelease = versions.length === 0;

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
            {isPrerelease ? ' (prerelease)' : ''}
          </Link>
        </TableCell>

        <TableCell>
          {mappedRelease.createdAt
            ? DateTime.fromISO(mappedRelease.createdAt)
                .setLocale('sv-SE')
                .toFormat('yyyy-MM-dd')
            : '-'}
        </TableCell>

        <TableCell>{candidates.length}</TableCell>

        <TableCell>{Math.max(0, versions.length - 1)}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                {!isPrerelease && (
                  <Box margin={1}>
                    {versions.map(version => (
                      <Typography key={version} variant="body1">
                        {version}
                      </Typography>
                    ))}
                  </Box>
                )}

                {!isPrerelease && (
                  <Box
                    margin={1}
                    style={{ transform: 'rotate(-45deg)', fontSize: 30 }}
                  >
                    {' 🚀 '}
                  </Box>
                )}

                <Box margin={1}>
                  {candidates.map(candidate => (
                    <Typography key={candidate} variant="body1">
                      {candidate}
                    </Typography>
                  ))}
                </Box>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
