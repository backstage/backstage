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
import { ComponentsGrid } from './ComponentsGrid';

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

/** @public */
export const OwnershipCard = (props: {
  variant?: InfoCardVariants;
  entityFilterKind?: string[];
  hideRelationsToggle?: boolean;
  relationsType?: string;
}) => {
  const { variant, entityFilterKind, hideRelationsToggle, relationsType } =
    props;
  const relationsToggle =
    hideRelationsToggle === undefined ? false : hideRelationsToggle;
  const classes = useStyles();
  const { entity } = useEntity();
  const isGroup = entity.kind === 'Group';
  const [getRelationsType, setRelationsType] = useState(
    relationsType || 'direct',
  );

  return (
    <InfoCard title="Ownership" variant={variant}>
      {!relationsToggle && (
        <List dense>
          <ListItem className={classes.list}>
            <ListItemText className={classes.listItemText} />
            <ListItemSecondaryAction
              className={classes.listItemSecondaryAction}
            >
              Direct Relations
              <Tooltip
                placement="top"
                arrow
                title={`${
                  getRelationsType === 'direct' ? 'Direct' : 'Aggregated'
                } Relations`}
              >
                <Switch
                  color="primary"
                  checked={getRelationsType !== 'direct'}
                  onChange={() =>
                    getRelationsType === 'direct'
                      ? setRelationsType('aggregated')
                      : setRelationsType('direct')
                  }
                  name="pin"
                  inputProps={{ 'aria-label': 'Ownership Type Switch' }}
                  disabled={!isGroup}
                />
              </Tooltip>
              Aggregated Relations
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      )}
      <ComponentsGrid
        entity={entity}
        relationsType={getRelationsType}
        isGroup={isGroup}
        entityFilterKind={entityFilterKind}
      />
    </InfoCard>
  );
};
