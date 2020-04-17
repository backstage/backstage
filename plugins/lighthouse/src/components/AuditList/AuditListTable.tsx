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
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TrendLine } from '@backstage/core';

import {
  Audit,
  AuditCompleted,
  LighthouseCategoryId,
  Website,
} from '../../api';
import { formatTime } from '../../utils';
import AuditStatusIcon from '../AuditStatusIcon';

export const CATEGORIES: LighthouseCategoryId[] = [
  'accessibility',
  'performance',
  'seo',
  'best-practices',
];

export const CATEGORY_LABELS: Record<LighthouseCategoryId, string> = {
  accessibility: 'Accessibility',
  performance: 'Performance',
  seo: 'SEO',
  'best-practices': 'Best Practices',
  pwa: 'Progressive Web App',
};

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

type SparklinesDataByCategory = Record<LighthouseCategoryId, number[]>;
function buildSparklinesDataForItem(item: Website): SparklinesDataByCategory {
  return item.audits
    .filter(
      (audit: Audit): audit is AuditCompleted => audit.status === 'COMPLETED',
    )
    .reduce((scores, audit) => {
      Object.values(audit.categories).forEach(category => {
        scores[category.id] = scores[category.id] || [];
        scores[category.id].unshift(category.score);
      });

      // edge case: if only one audit exists, force a "flat" sparkline
      Object.values(scores).forEach(arr => {
        if (arr.length === 1) arr.push(arr[0]);
      });

      return scores;
    }, {} as SparklinesDataByCategory);
}

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
            <TableRow key={website.url}>
              <TableCell>
                <Link
                  className={classes.link}
                  href={`/lighthouse/audit/${website.lastAudit.id}`}
                >
                  {website.url}
                </Link>
              </TableCell>
              {CATEGORIES.map(category => (
                <TableCell
                  key={`${website.url}|${category}`}
                  className={classes.sparklinesCell}
                >
                  <TrendLine
                    title={`trendline for ${CATEGORY_LABELS[category]} category of ${website.url}`}
                    data={categorySparklines[website.url][category] || []}
                  />
                </TableCell>
              ))}
              <TableCell className={classes.statusCell}>
                <AuditStatusIcon audit={website.lastAudit} />{' '}
                <span className={classes.status}>
                  {website.lastAudit.status.toLowerCase()}
                </span>
              </TableCell>
              <TableCell>{formatTime(website.lastAudit.timeCreated)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AuditListTable;
