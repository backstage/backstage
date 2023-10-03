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
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { Visit } from '../../api/VisitsApi';
import { ItemName } from './ItemName';
import { ItemDetail, ItemDetailType } from './ItemDetail';
import { ItemCategory } from './ItemCategory';

const useStyles = makeStyles(_theme => ({
  avatar: {
    minWidth: 0,
  },
}));
export const VisitListItem = ({
  visit,
  detailType,
}: {
  visit: Visit;
  detailType: ItemDetailType;
}) => {
  const classes = useStyles();

  return (
    <ListItem disableGutters>
      <ListItemAvatar className={classes.avatar}>
        <ItemCategory visit={visit} />
      </ListItemAvatar>
      <ListItemText
        primary={<ItemName visit={visit} />}
        secondary={<ItemDetail visit={visit} type={detailType} />}
        disableTypography
      />
    </ListItem>
  );
};
