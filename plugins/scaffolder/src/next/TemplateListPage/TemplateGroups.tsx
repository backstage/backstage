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
import React from 'react';
import { TemplateGroup } from './TemplateGroup';
import { Entity } from '@backstage/catalog-model';
import { useEntityList } from '@backstage/plugin-catalog-react';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { Progress, Link } from '@backstage/core-components';
import { Typography } from '@material-ui/core';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';

/**
 * @alpha
 */
export type TemplateGroupFilter = {
  title?: React.ReactNode;
  filter: (entity: Entity) => boolean;
};

export interface TemplateGroupsProps {
  groups: TemplateGroupFilter[];
  TemplateCardComponent?: React.ComponentType<{
    template: TemplateEntityV1beta3;
  }>;
}

export const TemplateGroups = (props: TemplateGroupsProps) => {
  const { loading, error, entities } = useEntityList();
  const { groups, TemplateCardComponent } = props;
  const errorApi = useApi(errorApiRef);

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
      {groups.map(({ title, filter }, index) => (
        <TemplateGroup
          key={index}
          templates={entities.filter((e): e is TemplateEntityV1beta3 =>
            filter(e),
          )}
          title={title}
          components={{ CardComponent: TemplateCardComponent }}
        />
      ))}
    </>
  );
};
