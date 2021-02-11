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

import { RELATION_HAS_PART, SystemEntity } from '@backstage/catalog-model';
import {
  CodeSnippet,
  InfoCard,
  Link,
  Progress,
  WarningPanel,
} from '@backstage/core';
import {
  EntityTable,
  useEntity,
  useRelatedEntities,
} from '@backstage/plugin-catalog-react';
import React, { PropsWithChildren } from 'react';

const SystemsCard = ({
  children,
  variant = 'gridItem',
}: PropsWithChildren<{ variant?: string }>) => {
  return (
    <InfoCard variant={variant} title="Systems">
      {children}
    </InfoCard>
  );
};

type Props = {
  variant?: string;
};

export const HasSystemsCard = ({ variant = 'gridItem' }: Props) => {
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: RELATION_HAS_PART,
  });

  if (loading) {
    return (
      <SystemsCard variant={variant}>
        <Progress />
      </SystemsCard>
    );
  }

  if (error || !entities) {
    return (
      <SystemsCard variant={variant}>
        <WarningPanel
          severity="error"
          title="Could not load systems"
          message={<CodeSnippet text={`${error}`} language="text" />}
        />
      </SystemsCard>
    );
  }

  return (
    <EntityTable
      title="Systems"
      variant={variant}
      emptyComponent={
        <div>
          No system is part of this domain.{' '}
          <Link to="https://backstage.io/docs/features/software-catalog/descriptor-format#kind-system">
            Learn how to add systems.
          </Link>
        </div>
      }
      columns={EntityTable.systemEntityColumns}
      entities={entities as SystemEntity[]}
    />
  );
};
