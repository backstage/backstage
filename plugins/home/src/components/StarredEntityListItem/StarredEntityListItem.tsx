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
import { Entity } from '@backstage/catalog-model';
import {
  EntityDisplayName,
  entityRouteParams,
} from '@backstage/plugin-catalog-react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import { Link } from 'react-router-dom';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { useRouteRef } from '@backstage/core-plugin-api';
import { FavoriteToggle } from '@backstage/core-components';
import { makeStyles } from '@material-ui/core/styles';

type EntityListItemProps = {
  entity: Entity;
  onToggleStarredEntity: (entity: Entity) => void;
  showKind?: boolean;
};

const useStyles = makeStyles(theme => ({
  listItem: {
    paddingBottom: theme.spacing(0),
    paddingTop: theme.spacing(0),
  },
  secondary: {
    textTransform: 'uppercase',
  },
}));

export const StarredEntityListItem = ({
  entity,
  onToggleStarredEntity,
  showKind,
}: EntityListItemProps) => {
  const classes = useStyles();
  const catalogEntityRoute = useRouteRef(entityRouteRef);

  let secondaryText = '';
  if (showKind) {
    secondaryText += entity.kind.toLocaleLowerCase('en-US');
  }
  if (entity.spec && 'type' in entity.spec) {
    if (showKind) {
      secondaryText += ' — ';
    }
    secondaryText += (entity.spec as { type: string }).type.toLocaleLowerCase(
      'en-US',
    );
  }

  return (
    <ListItem
      dense
      className={classes.listItem}
      component={Link}
      button
      to={catalogEntityRoute(entityRouteParams(entity))}
    >
      <ListItemIcon
        // Prevent following the link when clicking on the icon
        onClick={e => {
          e.preventDefault();
        }}
      >
        <FavoriteToggle
          id={`remove-favorite-${entity.metadata.uid}`}
          title="Remove entity from favorites"
          isFavorite
          onToggle={() => onToggleStarredEntity(entity)}
        />
      </ListItemIcon>
      <ListItemText
        primary={<EntityDisplayName hideIcon entityRef={entity} />}
        secondary={secondaryText}
      />
    </ListItem>
  );
};
