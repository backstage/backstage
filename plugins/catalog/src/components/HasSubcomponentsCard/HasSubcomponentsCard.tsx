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

import { ComponentEntity, RELATION_HAS_PART } from '@backstage/catalog-model';
import {
  CodeSnippet,
  InfoCard,
  Link,
  Progress,
  WarningPanel,
} from '@backstage/core';
import { Typography } from '@material-ui/core';
import {
  EntityTable,
  useEntity,
  useRelatedEntities,
} from '@backstage/plugin-catalog-react';
import React from 'react';

type Props = {
  variant?: 'gridItem';
};

const columns = [
  EntityTable.columns.createEntityRefColumn({ defaultKind: 'component' }),
  EntityTable.columns.createOwnerColumn(),
  EntityTable.columns.createSpecTypeColumn(),
  EntityTable.columns.createSpecLifecycleColumn(),
  EntityTable.columns.createMetadataDescriptionColumn(),
];

export const HasSubcomponentsCard = ({ variant = 'gridItem' }: Props) => {
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: RELATION_HAS_PART,
    kind: 'Component',
  });

  if (loading) {
    return (
      <InfoCard variant={variant} title="Subcomponents">
        <Progress />
      </InfoCard>
    );
  }

  if (error || !entities) {
    return (
      <InfoCard variant={variant} title="Subcomponents">
        <WarningPanel
          severity="error"
          title="Could not load subcomponents"
          message={<CodeSnippet text={`${error}`} language="text" />}
        />
      </InfoCard>
    );
  }

  return (
    <EntityTable
      title="Subcomponents"
      variant={variant}
      emptyContent={
        <div style={{ textAlign: 'center' }}>
          <Typography variant="body1">
            No subcomponent is part of this component.
          </Typography>
          <Typography variant="body2">
            <Link to="https://backstage.io/docs/features/software-catalog/descriptor-format#specsubcomponentof-optional">
              Learn how to change this.
            </Link>
          </Typography>
        </div>
      }
      columns={columns}
      entities={entities as ComponentEntity[]}
    />
  );
};
