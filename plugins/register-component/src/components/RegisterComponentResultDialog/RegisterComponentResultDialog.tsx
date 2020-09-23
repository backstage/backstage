/*
 * Copyright 2020 Spotify AB
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  List,
  ListItem,
  Link,
  Divider,
  DialogActions,
  Button,
} from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import { StructuredMetadataTable, RouteRef } from '@backstage/core';
import { generatePath, resolvePath } from 'react-router';
import { entityRoute } from '@backstage/plugin-catalog';
import { Link as RouterLink } from 'react-router-dom';

type Props = {
  onClose: () => void;
  classes?: Record<string, string>;
  entities: Entity[];
  catalogRouteRef: RouteRef;
};

const getEntityCatalogPath = ({
  entity,
  catalogRouteRef,
}: {
  entity: Entity;
  catalogRouteRef: RouteRef;
}) => {
  const optionalNamespaceAndName = [
    entity.metadata.namespace,
    entity.metadata.name,
  ]
    .filter(Boolean)
    .join(':');

  const relativeEntityPathInsideCatalog = generatePath(entityRoute.path, {
    optionalNamespaceAndName,
    kind: entity.kind,
  });

  const resolvedAbsolutePath = resolvePath(
    relativeEntityPathInsideCatalog,
    catalogRouteRef.path,
  )?.pathname;
  return resolvedAbsolutePath;
};

export const RegisterComponentResultDialog = ({
  onClose,
  classes,
  entities,
  catalogRouteRef,
}: Props) => (
  <Dialog open onClose={onClose} classes={classes}>
    <DialogTitle>Registration Result</DialogTitle>
    <DialogContent>
      <DialogContentText>
        The following entities have been successfully created:
      </DialogContentText>
      <List>
        {entities.map((entity: any, index: number) => {
          const entityPath = getEntityCatalogPath({ entity, catalogRouteRef });
          return (
            <React.Fragment
              key={`${entity.metadata.namespace}-${entity.metadata.name}`}
            >
              <ListItem>
                <StructuredMetadataTable
                  dense
                  metadata={{
                    name: entity.metadata.name,
                    type: entity.spec.type,
                    link: (
                      <Link component={RouterLink} to={entityPath}>
                        {entityPath}
                      </Link>
                    ),
                  }}
                />
              </ListItem>
              {index < entities.length - 1 && <Divider component="li" />}
            </React.Fragment>
          );
        })}
      </List>
    </DialogContent>
    <DialogActions>
      <Button
        component={RouterLink}
        to={`/${catalogRouteRef.path}`}
        color="default"
      >
        To Catalog
      </Button>
    </DialogActions>
  </Dialog>
);
