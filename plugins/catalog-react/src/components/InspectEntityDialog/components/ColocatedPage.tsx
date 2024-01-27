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
  Entity,
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import {
  DialogContentText,
  List,
  ListItem,
  makeStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { catalogApiRef } from '../../../api';
import { EntityRefLink } from '../../EntityRefLink';
import { KeyValueListItem, ListItemText } from './common';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
});

function useColocated(entity: Entity): {
  loading: boolean;
  error?: Error;
  location?: string;
  originLocation?: string;
  colocatedEntities?: Entity[];
} {
  const catalogApi = useApi(catalogApiRef);
  const currentEntityRef = stringifyEntityRef(entity);
  const location = entity.metadata.annotations?.[ANNOTATION_LOCATION];
  const origin = entity.metadata.annotations?.[ANNOTATION_ORIGIN_LOCATION];

  const { loading, error, value } = useAsync(async () => {
    if (!location && !origin) {
      return [];
    }
    const response = await catalogApi.getEntities({
      filter: [
        ...(location
          ? [{ [`metadata.annotations.${ANNOTATION_LOCATION}`]: location }]
          : []),
        ...(origin
          ? [{ [`metadata.annotations.${ANNOTATION_ORIGIN_LOCATION}`]: origin }]
          : []),
      ],
    });
    return response.items;
  }, [location, origin]);

  return {
    loading,
    error,
    location,
    originLocation: origin,
    colocatedEntities: value?.filter(
      colocated => stringifyEntityRef(colocated) !== currentEntityRef,
    ),
  };
}

function EntityList(props: { entities: Entity[]; header?: [string, string] }) {
  return (
    <List dense>
      {props.header && <KeyValueListItem key="header" entry={props.header} />}
      {props.entities.map(entity => (
        <ListItem key={stringifyEntityRef(entity)}>
          <ListItemText primary={<EntityRefLink entityRef={entity} />} />
        </ListItem>
      ))}
    </List>
  );
}

function Contents(props: { entity: Entity }) {
  const { entity } = props;

  const { loading, error, location, originLocation, colocatedEntities } =
    useColocated(entity);
  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  if (!location && !originLocation) {
    return (
      <Alert severity="warning">Entity had no location information.</Alert>
    );
  } else if (!colocatedEntities?.length) {
    return (
      <Alert severity="info">
        There were no other entities on this location.
      </Alert>
    );
  }

  if (location === originLocation) {
    return <EntityList entities={colocatedEntities} />;
  }

  const atLocation = colocatedEntities.filter(
    e => e.metadata.annotations?.[ANNOTATION_LOCATION] === location,
  );
  const atOrigin = colocatedEntities.filter(
    e =>
      e.metadata.annotations?.[ANNOTATION_ORIGIN_LOCATION] === originLocation,
  );

  return (
    <>
      {atLocation.length > 0 && (
        <EntityList
          entities={atLocation}
          header={['At the same location', location!]}
        />
      )}
      {atOrigin.length > 0 && (
        <EntityList
          entities={atOrigin}
          header={['At the same origin', originLocation!]}
        />
      )}
    </>
  );
}

export function ColocatedPage(props: { entity: Entity }) {
  const classes = useStyles();
  return (
    <>
      <DialogContentText variant="h2">Colocated</DialogContentText>
      <DialogContentText>
        These are the entities that are colocated with this entity - as in, they
        originated from the same data source (e.g. came from the same YAML
        file), or from the same origin (e.g. the originally registered URL).
      </DialogContentText>
      <div className={classes.root}>
        <Contents entity={props.entity} />
      </div>
    </>
  );
}
