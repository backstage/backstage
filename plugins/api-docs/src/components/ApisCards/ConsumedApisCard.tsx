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

import {
  ApiEntity,
  Entity,
  RELATION_CONSUMES_API,
} from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { EmptyState, InfoCard, Progress } from '@backstage/core';
import React, { PropsWithChildren } from 'react';
import { ApisTable } from './ApisTable';
import { MissingConsumesApisEmptyState } from '../EmptyState';
import { useRelatedEntities } from '../useRelatedEntities';

const ApisCard = ({
  children,
  variant = 'gridItem',
}: PropsWithChildren<{ variant?: string }>) => {
  return (
    <InfoCard variant={variant} title="Consumed APIs">
      {children}
    </InfoCard>
  );
};

type Props = {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
  variant?: string;
};

export const ConsumedApisCard = ({ variant = 'gridItem' }: Props) => {
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(
    entity,
    RELATION_CONSUMES_API,
  );

  if (loading) {
    return (
      <ApisCard variant={variant}>
        <Progress />
      </ApisCard>
    );
  }

  if (error) {
    return (
      <ApisCard variant={variant}>
        <EmptyState
          missing="info"
          title="No information to display"
          description="There was an error while loading the consumed APIs."
        />
      </ApisCard>
    );
  }

  if (!entities || entities.length === 0) {
    return (
      <ApisCard variant={variant}>
        <MissingConsumesApisEmptyState />
      </ApisCard>
    );
  }

  return (
    <ApisTable
      title="Consumed APIs"
      variant={variant}
      entities={entities as (ApiEntity | undefined)[]}
    />
  );
};
