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

import {
  ComponentEntity,
  RELATION_API_PROVIDED_BY,
} from '@backstage/catalog-model';
import { Typography } from '@material-ui/core';
import {
  EntityTable,
  useEntity,
  useRelatedEntities,
} from '@backstage/plugin-catalog-react';
import React from 'react';
import {
  CodeSnippet,
  InfoCard,
  InfoCardVariants,
  Link,
  Progress,
  WarningPanel,
} from '@backstage/core-components';

/** @public */
export const ProvidingComponentsCard = (props: {
  variant?: InfoCardVariants;
}) => {
  const { variant = 'gridItem' } = props;
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: RELATION_API_PROVIDED_BY,
  });

  if (loading) {
    return (
      <InfoCard variant={variant} title="Providers">
        <Progress />
      </InfoCard>
    );
  }

  if (error || !entities) {
    return (
      <InfoCard variant={variant} title="Providers">
        <WarningPanel
          severity="error"
          title="Could not load components"
          message={<CodeSnippet text={`${error}`} language="text" />}
        />
      </InfoCard>
    );
  }

  return (
    <EntityTable
      title="Providers"
      variant={variant}
      emptyContent={
        <div style={{ textAlign: 'center' }}>
          <Typography variant="body1">
            No component provides this API.
          </Typography>
          <Typography variant="body2">
            <Link to="https://backstage.io/docs/features/software-catalog/descriptor-format#specprovidesapis-optional">
              Learn how to change this.
            </Link>
          </Typography>
        </div>
      }
      columns={EntityTable.componentEntityColumns}
      entities={entities as ComponentEntity[]}
    />
  );
};
