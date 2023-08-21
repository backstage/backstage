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
import {
  Collapse,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles(_theme => ({
  skeleton: {
    borderRadius: 30,
  },
}));

const VisitListItemSkeleton = () => {
  const classes = useStyles();

  return (
    <ListItem disableGutters>
      <ListItemAvatar>
        <Skeleton
          className={classes.skeleton}
          variant="rect"
          width={50}
          height={24}
        />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton variant="text" width="100%" height={28} />}
        disableTypography
      />
    </ListItem>
  );
};

export const VisitListSkeleton = ({
  numVisitsOpen,
  numVisitsTotal,
  collapsed,
}: {
  numVisitsOpen: number;
  numVisitsTotal: number;
  collapsed: boolean;
}) => (
  <>
    {Array(numVisitsOpen)
      .fill(null)
      .map((_e, index) => (
        <VisitListItemSkeleton key={index} />
      ))}
    {numVisitsTotal > numVisitsOpen && (
      <Collapse in={!collapsed}>
        {Array(numVisitsTotal - numVisitsOpen)
          .fill(null)
          .map((_e, index) => (
            <VisitListItemSkeleton key={index} />
          ))}
      </Collapse>
    )}
  </>
);
