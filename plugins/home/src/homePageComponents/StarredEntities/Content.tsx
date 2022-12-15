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
  catalogApiRef,
  useStarredEntities,
  entityRouteParams,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { Link, Progress, ResponseErrorPanel } from '@backstage/core-components';
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
import useAsync from 'react-use/lib/useAsync';

/**
 * A component to display a list of starred entities for the user.
 *
 * @public
 */

export const Content = (props: {
  noStarredEntitiesMessage?: React.ReactNode | undefined;
}) => {
  const catalogApi = useApi(catalogApiRef);
  const catalogEntityRoute = useRouteRef(entityRouteRef);
  const { starredEntities, toggleStarredEntity } = useStarredEntities();

  // Grab starred entities from catalog to ensure they still exist and also retrieve display titles
  const entities = useAsync(async () => {
    if (!starredEntities.size) {
      return [];
    }

    const filter = [...starredEntities]
      .map(ent => parseEntityRef(ent))
      .map(ref => ({
        kind: ref.kind,
        'metadata.namespace': ref.namespace,
        'metadata.name': ref.name,
      }));

    return (
      await catalogApi.getEntities({
        filter,
        fields: [
          'kind',
          'metadata.namespace',
          'metadata.name',
          'metadata.title',
        ],
      })
    ).items;
  }, [catalogApi, starredEntities]);

  if (starredEntities.size === 0)
    return (
      <Typography variant="body1">
        {props.noStarredEntitiesMessage ||
          'Click the star beside an entity name to add it to this list!'}
      </Typography>
    );

  if (entities.loading) {
    return <Progress />;
  }

  return entities.error ? (
    <ResponseErrorPanel error={entities.error} />
  ) : (
    <List>
      {entities.value
        ?.sort((a, b) =>
          (a.metadata.title ?? a.metadata.name).localeCompare(
            b.metadata.title ?? b.metadata.name,
          ),
        )
        .map(entity => (
          <ListItem key={stringifyEntityRef(entity)}>
            <Link to={catalogEntityRoute(entityRouteParams(entity))}>
              <ListItemText
                primary={entity.metadata.title ?? entity.metadata.name}
              />
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
