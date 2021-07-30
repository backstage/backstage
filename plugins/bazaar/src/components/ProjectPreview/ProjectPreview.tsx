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

import { ItemCardGrid, Content } from '@backstage/core';
import React from 'react';
import { ProjectCard } from '../ProjectCard/ProjectCard';
import { Entity } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/config';

type Props = {
  entities: Entity[];
};

export const compareEntitiesByDate = (a: Entity, b: Entity): number => {
  const dateA = new Date(
    (a?.metadata?.bazaar as JsonObject).last_modified as string,
  ).getTime();
  const dateB = new Date(
    (b?.metadata?.bazaar as JsonObject).last_modified as string,
  ).getTime();
  return dateB - dateA;
};

export const ProjectPreview = ({ entities }: Props) => {
  if (!entities.length) {
    return (
      <div
        data-testid="empty-bazaar"
        style={{
          height: '10rem',
          textAlign: 'center',
          verticalAlign: 'middle',
          lineHeight: '10rem',
        }}
      >
        Please add projects to the Bazaar.
      </div>
    );
  }
  entities.sort(compareEntitiesByDate);

  return (
    <Content noPadding>
      <ItemCardGrid>
        {entities.slice(0, 5).map((entity: Entity) => (
          <ProjectCard key={entity.metadata.uid || ''} entity={entity} />
        ))}
      </ItemCardGrid>
    </Content>
  );
};
