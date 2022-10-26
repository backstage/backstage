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

import { DocsCardGrid } from './DocsCardGrid';
import { Entity } from '@backstage/catalog-model';
import {
  CodeSnippet,
  Content,
  ContentHeader,
  Link,
  Progress,
  WarningPanel,
} from '@backstage/core-components';
import {
  useEntityList,
  useEntityOwnership,
} from '@backstage/plugin-catalog-react';
import { Typography } from '@material-ui/core';
import React from 'react';

/**
 * Props for {@link EntityListDocsGrid}
 *
 * @public
 */
export type DocsGroupConfig = {
  title: React.ReactNode;
  filterPredicate: ((entity: Entity) => boolean) | string;
};

/**
 * Props for {@link EntityListDocsGrid}
 *
 * @public
 */
export type EntityListDocsGridPageProps = {
  groups?: DocsGroupConfig[];
};

const allEntitiesGroup: DocsGroupConfig = {
  title: 'All Documentation',
  filterPredicate: () => true,
};

const EntityListDocsGridGroup = ({
  entities,
  group,
}: {
  group: DocsGroupConfig;
  entities: Entity[];
}) => {
  const { loading: loadingOwnership, isOwnedEntity } = useEntityOwnership();

  const shownEntities = entities.filter(entity => {
    if (group.filterPredicate === 'ownedByUser') {
      if (loadingOwnership) {
        return false;
      }
      return isOwnedEntity(entity);
    }

    return (
      typeof group.filterPredicate === 'function' &&
      group.filterPredicate(entity)
    );
  });

  const titleComponent: React.ReactNode = (() => {
    return typeof group.title === 'string' ? (
      <ContentHeader title={group.title} />
    ) : (
      group.title
    );
  })();

  if (shownEntities.length === 0) {
    return null;
  }

  return (
    <Content>
      {titleComponent}
      <DocsCardGrid entities={shownEntities} />
    </Content>
  );
};

/**
 * Component responsible to get entities from entity list context and pass down to DocsCardGrid
 *
 * @public
 */
export const EntityListDocsGrid = ({ groups }: EntityListDocsGridPageProps) => {
  const { loading, error, entities } = useEntityList();

  if (error) {
    return (
      <WarningPanel
        severity="error"
        title="Could not load available documentation."
      >
        <CodeSnippet language="text" text={error.toString()} />
      </WarningPanel>
    );
  }

  if (loading) {
    return <Progress />;
  }

  if (entities.length === 0) {
    return (
      <div data-testid="doc-not-found">
        <Typography variant="body2">
          No documentation found that match your filter. Learn more about{' '}
          <Link to="https://backstage.io/docs/features/techdocs/creating-and-publishing">
            publishing documentation
          </Link>
          .
        </Typography>
      </div>
    );
  }

  entities.sort((a, b) =>
    (a.metadata.title ?? a.metadata.name).localeCompare(
      b.metadata.title ?? b.metadata.name,
    ),
  );

  return (
    <Content>
      {(groups || [allEntitiesGroup]).map((group, index: number) => (
        <EntityListDocsGridGroup
          entities={entities}
          group={group}
          key={`${group.title}-${index}`}
        />
      ))}
    </Content>
  );
};
