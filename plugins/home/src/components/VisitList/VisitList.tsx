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
import { Collapse, List, Typography, makeStyles } from '@material-ui/core';
import { Visit } from '../../api/VisitsApi';
import { VisitListItem } from './VisitListItem';
import { ItemDetailType } from './ItemDetail';
import { VisitListEmpty } from './VisitListEmpty';
import { VisitListFew } from './VisitListFew';
import { VisitListSkeleton } from './VisitListSkeleton';

const useStyles = makeStyles(_theme => ({
  title: {
    marginBottom: '2rem',
  },
}));

export const VisitList = ({
  title,
  detailType,
  visits = [],
  numVisitsOpen = 3,
  numVisitsTotal = 8,
  collapsed = true,
  loading = false,
}: {
  title: string;
  detailType: ItemDetailType;
  visits?: Visit[];
  numVisitsOpen?: number;
  numVisitsTotal?: number;
  collapsed?: boolean;
  loading?: boolean;
}) => {
  const classes = useStyles();

  let listBody: React.ReactElement = <></>;
  if (loading) {
    listBody = (
      <VisitListSkeleton
        numVisitsOpen={numVisitsOpen}
        numVisitsTotal={numVisitsTotal}
        collapsed={collapsed}
      />
    );
  } else if (visits.length === 0) {
    listBody = <VisitListEmpty />;
  } else if (visits.length < numVisitsOpen) {
    listBody = (
      <>
        {visits.map((visit, index) => (
          <VisitListItem visit={visit} key={index} detailType={detailType} />
        ))}
        <VisitListFew />
      </>
    );
  } else {
    listBody = (
      <>
        {visits.slice(0, numVisitsOpen).map((visit, index) => (
          <VisitListItem visit={visit} key={index} detailType={detailType} />
        ))}
        {visits.length > numVisitsOpen && (
          <Collapse in={!collapsed}>
            {visits.slice(numVisitsOpen, numVisitsTotal).map((visit, index) => (
              <VisitListItem
                visit={visit}
                key={index}
                detailType={detailType}
              />
            ))}
          </Collapse>
        )}
      </>
    );
  }

  return (
    <>
      <Typography variant="h5" className={classes.title}>
        {title}
      </Typography>
      <List dense disablePadding>
        {listBody}
      </List>
    </>
  );
};
