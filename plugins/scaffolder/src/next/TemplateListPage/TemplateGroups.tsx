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
import { TemplateGroup } from './TemplateGroup';
import { Entity } from '@backstage/catalog-model';
import { useEntityList } from '@backstage/plugin-catalog-react';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';

export type TemplateGroupFilter = {
  title?: string;
  titleComponent?: React.ReactNode;
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
  return null;
};
