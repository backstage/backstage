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
import React, { FC } from 'react';
import {
  Link,
  TableCell,
  TableRow,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TrendLine } from '@backstage/core';
import {
  Website,
} from '../../api';
import { formatTime, CATEGORIES, CATEGORY_LABELS, SparklinesDataByCategory } from '../../utils';
import AuditStatusIcon from '../AuditStatusIcon';

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

export const AuditRow: FC<{
  website: Website;
  categorySparkline: SparklinesDataByCategory;
}> = ({ website, categorySparkline }) => {
  const classes = useStyles();

  return (
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
            data={categorySparkline[category] || []}
          />
        </TableCell>
      ))}
      <TableCell className={classes.statusCell}>
        <AuditStatusIcon audit={website.lastAudit} />{' '}
        <span className={classes.status}>
          {website.lastAudit.status.toLowerCase()}
        </span>
      </TableCell>
      <TableCell>
        {formatTime(website.lastAudit.timeCreated)}
      </TableCell>
    </TableRow>
  );
};

export default AuditRow;
