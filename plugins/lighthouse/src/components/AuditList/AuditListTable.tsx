/*
 * Copyright 2020 Spotify AB
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
import React, { FC, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Website,
} from '../../api';
import { CATEGORIES, CATEGORY_LABELS, SparklinesDataByCategory, buildSparklinesDataForItem } from '../../utils';
import Audit from '../Audit'

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  status: {
    textTransform: 'capitalize',
  },
  link: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'inline-block',
  },
  statusCell: { whiteSpace: 'nowrap' },
  sparklinesCell: { minWidth: 120 },
}));

export const AuditListTable: FC<{ items: Website[] }> = ({ items }) => {
  const classes = useStyles();
  const categorySparklines: Record<string, SparklinesDataByCategory> = useMemo(
    () =>
      items.reduce(
        (res, item) => ({
           ...res,
          [item.url]: buildSparklinesDataForItem(item),
        }),
        {},
      ),
    [items],
  );

  return (
    <TableContainer>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Website URL</TableCell>
            {CATEGORIES.map(category => (
              <TableCell key={`${category}-label`}>
                {CATEGORY_LABELS[category]}
              </TableCell>
            ))}
            <TableCell>Last Report</TableCell>
            <TableCell>Last Audit Triggered</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(website => (
            <Audit
              key={website.url}
              website={website}
              categorySparkline={categorySparklines[website.url]}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AuditListTable;
