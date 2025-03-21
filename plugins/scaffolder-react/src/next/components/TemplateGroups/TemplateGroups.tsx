/*
 * Copyright 2022 The Backstage Authors
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
import { Link, Progress } from '@backstage/core-components';
import { errorApiRef, IconComponent, useApi } from '@backstage/core-plugin-api';
import { useEntityList } from '@backstage/plugin-catalog-react';
import {
  isTemplateEntityV1beta3,
  TemplateEntityV1beta3,
} from '@backstage/plugin-scaffolder-common';
import { TemplateGroupFilter } from '@backstage/plugin-scaffolder-react';
import Typography from '@material-ui/core/Typography';
import React, { useCallback } from 'react';

import { TemplateGroup } from '../TemplateGroup/TemplateGroup';

/**
 * @alpha
 */
export interface TemplateGroupsProps {
  groups: TemplateGroupFilter[];
  templateFilter?: (entity: TemplateEntityV1beta3) => boolean;
  TemplateCardComponent?: React.ComponentType<{
    template: TemplateEntityV1beta3;
  }>;
  onTemplateSelected?: (template: TemplateEntityV1beta3) => void;
  additionalLinksForEntity?: (template: TemplateEntityV1beta3) => {
    icon: IconComponent;
    text: string;
    url: string;
  }[];
}

/**
 * @alpha
 */
export const TemplateGroups = (props: TemplateGroupsProps) => {
  const { loading, error, entities } = useEntityList();
  const { groups, templateFilter, TemplateCardComponent, onTemplateSelected } =
    props;
  const errorApi = useApi(errorApiRef);
  const onSelected = useCallback(
    (template: TemplateEntityV1beta3) => {
      onTemplateSelected?.(template);
    },
    [onTemplateSelected],
  );

  if (loading) {
    return <Progress />;
  }

  if (error) {
    errorApi.post(error);
    return null;
  }

  if (!entities || !entities.length) {
    return (
      <Typography variant="body2">
        No templates found that match your filter. Learn more about{' '}
        <Link to="https://backstage.io/docs/features/software-templates/adding-templates">
          adding templates
        </Link>
        .
      </Typography>
    );
  }

  return (
    <>
      {groups.map(({ title, filter }, index) => {
        const templates = entities
          .filter(isTemplateEntityV1beta3)
          .filter(e => (templateFilter ? templateFilter(e) : true))
          .filter(filter)
          .map(template => {
            const additionalLinks =
              props.additionalLinksForEntity?.(template) ?? [];

            return {
              template,
              additionalLinks,
            };
          });

        return (
          <TemplateGroup
            key={index}
            templates={templates}
            title={title}
            components={{ CardComponent: TemplateCardComponent }}
            onSelected={onSelected}
          />
        );
      })}
    </>
  );
};
