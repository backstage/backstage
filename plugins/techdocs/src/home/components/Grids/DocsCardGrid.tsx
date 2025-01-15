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
import useAsync from 'react-use/esm/useAsync';
import {
  EntityRefPresentationSnapshot,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { useApi, useRouteRef, configApiRef } from '@backstage/core-plugin-api';
import {
  LinkButton,
  ItemCardGrid,
  ItemCardHeader,
  Progress,
} from '@backstage/core-components';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
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
  const entityPresentationApi = useApi(entityPresentationApiRef);
  const { value: entityRefToPresentation, loading } = useAsync(async () => {
    return new Map<string, EntityRefPresentationSnapshot>(
      await Promise.all(
        entities?.map(async entity => {
          const presentation = await entityPresentationApi.forEntity(entity)
            .promise;
          return [stringifyEntityRef(entity), presentation] as [
            string,
            EntityRefPresentationSnapshot,
          ];
        }) || [],
      ),
    );
  });
  if (loading) return <Progress />;
  if (!entities) return null;
  return (
    <ItemCardGrid data-testid="docs-explore">
      {!entities?.length
        ? null
        : entities.map((entity, index: number) => (
            <Card key={index}>
              <CardMedia>
                <ItemCardHeader
                  title={
                    entityRefToPresentation?.get(stringifyEntityRef(entity))
                      ?.primaryTitle
                  }
                />
              </CardMedia>
              <CardContent>{entity.metadata.description}</CardContent>
              <CardActions>
                <LinkButton
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
                </LinkButton>
              </CardActions>
            </Card>
          ))}
    </ItemCardGrid>
  );
};
