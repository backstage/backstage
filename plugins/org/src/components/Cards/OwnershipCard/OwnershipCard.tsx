/*
 * Copyright 2020 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { InfoCard, InfoCardVariants } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Switch,
  Tooltip,
} from '@material-ui/core';
import React, { useState } from 'react';
import { DirectRelationsGrid } from './DirectRelationsGrid';
import { TransitiveRelationsGrid } from './TransitiveRelationsGrid';

const useStyles = makeStyles(theme => ({
  list: {
    [theme.breakpoints.down('xs')]: {
      padding: `0 0 12px`,
    },
  },
  listItemText: {
    [theme.breakpoints.down('xs')]: {
      paddingRight: 0,
      paddingLeft: 0,
    },
  },
  listItemSecondaryAction: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      top: 'auto',
      right: 'auto',
      position: 'relative',
      transform: 'unset',
    },
  },
}));

const directRelationsGrid = (entity: Entity, entityFilterKind?: string[]) => {
  return (
    <DirectRelationsGrid entity={entity} entityFilterKind={entityFilterKind} />
  );
};

const transitiveRelationsGrid = (
  entity: Entity,
  entityFilterKind?: string[],
) => {
  return (
    <TransitiveRelationsGrid
      entity={entity}
      entityFilterKind={entityFilterKind}
    />
  );
};

export const OwnershipCard = ({
  variant,
  entityFilterKind,
}: {
  variant?: InfoCardVariants;
  entityFilterKind?: string[];
}) => {
  const classes = useStyles();
  const { entity } = useEntity();
  const isGroup = entity.kind === 'Group';
  const [relationsType, setRelationsType] = useState('direct');
  const renderedGrid =
    relationsType !== 'direct' && isGroup
      ? transitiveRelationsGrid(entity, entityFilterKind)
      : directRelationsGrid(entity, entityFilterKind);

  return (
    <InfoCard title="Ownership" variant={variant}>
      <List dense>
        <ListItem className={classes.list}>
          <ListItemText className={classes.listItemText} />
          <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
            Direct Relations
            <Tooltip
              placement="top"
              arrow
              title={`${relationsType === 'direct' ? 'Direct' : 'Transitive'
                } Relations`}
            >
              <Switch
                color="primary"
                checked={relationsType !== 'direct'}
                onChange={() =>
                  relationsType === 'direct'
                    ? setRelationsType('transitive')
                    : setRelationsType('direct')
                }
                name="pin"
                inputProps={{ 'aria-label': 'Pin Sidebar Switch' }}
                disabled={!isGroup}
              />
            </Tooltip>
            Transitive Relations
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      {renderedGrid}
    </InfoCard>
  );
};
