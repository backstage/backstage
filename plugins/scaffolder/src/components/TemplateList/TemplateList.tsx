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

import React, { ComponentType } from 'react';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import {
  Content,
  ContentHeader,
  ItemCardGrid,
  Link,
  Progress,
  WarningPanel,
} from '@backstage/core-components';
import { useEntityList } from '@backstage/plugin-catalog-react';
import { Typography } from '@material-ui/core';
import { TemplateCard } from '../TemplateCard';

/**
 * @internal
 */
export type TemplateListProps = {
  TemplateCardComponent?:
    | ComponentType<{ template: TemplateEntityV1beta3 }>
    | undefined;
  group?: {
    title?: React.ReactNode;
    filter: (entity: Entity) => boolean;
  };
};

/**
 * @internal
 */
export const TemplateList = ({
  TemplateCardComponent,
  group,
}: TemplateListProps) => {
  const { loading, error, entities } = useEntityList();
  const Card = TemplateCardComponent || TemplateCard;
  const maybeFilteredEntities = group
    ? entities.filter(e => group.filter(e))
    : entities;

  const titleComponent: React.ReactNode = (() => {
    if (group && group.title) {
      if (typeof group.title === 'string') {
        return <ContentHeader title={group.title} />;
      }
      return group.title;
    }

    return <ContentHeader title="Other Templates" />;
  })();

  if (group && maybeFilteredEntities.length === 0) {
    return null;
  }
  return (
    <>
      {loading && <Progress />}

      {error && (
        <WarningPanel title="Oops! Something went wrong loading the templates">
          {error.message}
        </WarningPanel>
      )}

      {!error && !loading && !entities.length && (
        <Typography variant="body2">
          No templates found that match your filter. Learn more about{' '}
          <Link to="https://backstage.io/docs/features/software-templates/adding-templates">
            adding templates
          </Link>
          .
        </Typography>
      )}

      <Content>
        {titleComponent}
        <ItemCardGrid>
          {maybeFilteredEntities &&
            maybeFilteredEntities?.length > 0 &&
            maybeFilteredEntities.map((template: Entity) => (
              <Card
                key={stringifyEntityRef(template)}
                template={template as TemplateEntityV1beta3}
                deprecated={template.apiVersion === 'backstage.io/v1beta2'}
              />
            ))}
        </ItemCardGrid>
      </Content>
    </>
  );
};
