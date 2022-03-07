/*
 * Copyright 2021 The Backstage Authors
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

import { rootDocsRouteRef } from '../../../routes';
import { toLowerMaybe } from '../../../helpers';
import { Entity } from '@backstage/catalog-model';
import { useApi, useRouteRef, configApiRef } from '@backstage/core-plugin-api';
import {
  Button,
  ItemCardGrid,
  ItemCardHeader,
} from '@backstage/core-components';
import { Card, CardActions, CardContent, CardMedia } from '@material-ui/core';
import React from 'react';

/**
 * Props for {@link DocsCardGrid}
 *
 * @public
 */
export type DocsCardGridProps = {
  entities: Entity[] | undefined;
};

/**
 * Component which accepts a list of entities and renders a item card for each entity
 *
 * @public
 */
export const DocsCardGrid = (props: DocsCardGridProps) => {
  const { entities } = props;
  const getRouteToReaderPageFor = useRouteRef(rootDocsRouteRef);
  const config = useApi(configApiRef);
  if (!entities) return null;
  return (
    <ItemCardGrid data-testid="docs-explore">
      {!entities?.length
        ? null
        : entities.map((entity, index: number) => (
            <Card key={index}>
              <CardMedia>
                <ItemCardHeader
                  title={entity.metadata.title ?? entity.metadata.name}
                />
              </CardMedia>
              <CardContent>{entity.metadata.description}</CardContent>
              <CardActions>
                <Button
                  to={getRouteToReaderPageFor({
                    namespace: toLowerMaybe(
                      entity.metadata.namespace ?? 'default',
                      config,
                    ),
                    kind: toLowerMaybe(entity.kind, config),
                    name: toLowerMaybe(entity.metadata.name, config),
                  })}
                  color="primary"
                  data-testid="read_docs"
                >
                  Read Docs
                </Button>
              </CardActions>
            </Card>
          ))}
    </ItemCardGrid>
  );
};
