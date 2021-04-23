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
  Collapse,
  IconButton,
  Link,
  makeStyles,
  TableCell,
  TableRow,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { getReleasesWithTags } from '../helpers/getReleasesWithTags';
import { RowCollapsed } from './RowCollapsed/RowCollapsed';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

interface RowProps {
  baseVersion: string;
  releaseWithTags: ReturnType<
    typeof getReleasesWithTags
  >['releasesWithTags']['releases']['0'];
}

export function Row({ baseVersion, releaseWithTags }: RowProps) {
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
          <Link href={releaseWithTags.htmlUrl} target="_blank">
            {baseVersion}
            {releaseWithTags.versions.length === 0 ? ' (prerelease)' : ''}
          </Link>
        </TableCell>

        <TableCell>
          {releaseWithTags.createdAt
            ? DateTime.fromISO(releaseWithTags.createdAt)
                .setLocale('sv-SE')
                .toFormat('yyyy-MM-dd')
            : '-'}
        </TableCell>

        <TableCell>{releaseWithTags.candidates.length}</TableCell>

        <TableCell>
          {Math.max(0, releaseWithTags.versions.length - 1)}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <RowCollapsed releaseWithTags={releaseWithTags} />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
