/*
 * Copyright 2022 The Backstage Authors
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

import {
  useStarredEntities,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { parseEntityRef } from '@backstage/catalog-model';
import { useRouteRef } from '@backstage/core-plugin-api';
import { Link } from '@backstage/core-components';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  ListItemText,
  Tooltip,
  Typography,
} from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import React from 'react';

/**
 * A component to display a list of starred entities for the user.
 *
 * @public
 */
export const Content = () => {
  const catalogEntityRoute = useRouteRef(entityRouteRef);
  const { starredEntities, toggleStarredEntity } = useStarredEntities();

  if (starredEntities.size === 0)
    return (
      <Typography variant="body1">
        You do not have any starred entities yet!
      </Typography>
    );

  return (
    <List>
      {Array.from(starredEntities).map(entity => (
        <ListItem key={entity}>
          <Link to={catalogEntityRoute(parseEntityRef(entity))}>
            <ListItemText primary={parseEntityRef(entity).name} />
          </Link>
          <ListItemSecondaryAction>
            <Tooltip title="Remove from starred">
              <IconButton
                edge="end"
                aria-label="unstar"
                onClick={() => toggleStarredEntity(entity)}
              >
                <StarIcon style={{ color: '#f3ba37' }} />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};
