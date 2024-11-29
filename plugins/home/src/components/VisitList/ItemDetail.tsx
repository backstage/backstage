/*
 * Copyright 2023 The Backstage Authors
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
import Typography from '@material-ui/core/Typography';
import { Visit } from '../../api/VisitsApi';
import { DateTime } from 'luxon';

const ItemDetailHits = ({ visit }: { visit: Visit }) => (
  <Typography component="span" variant="caption" color="textSecondary">
    {visit.hits} time{visit.hits > 1 ? 's' : ''}
  </Typography>
);

const ItemDetailTimeAgo = ({ visit }: { visit: Visit }) => {
  const visitDate = DateTime.fromMillis(visit.timestamp);

  return (
    <Typography
      component="time"
      variant="caption"
      color="textSecondary"
      dateTime={visitDate.toISO() ?? undefined}
    >
      {visitDate.toRelative()}
    </Typography>
  );
};

export type ItemDetailType = 'time-ago' | 'hits';

export const ItemDetail = ({
  visit,
  type,
}: {
  visit: Visit;
  type: ItemDetailType;
}) =>
  type === 'time-ago' ? (
    <ItemDetailTimeAgo visit={visit} />
  ) : (
    <ItemDetailHits visit={visit} />
  );
