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
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import React from 'react';
import {
  Content,
  ContentHeader,
  ItemCardGrid,
  Link,
} from '@backstage/core-components';
import { Typography } from '@material-ui/core';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { TemplateCardProps, TemplateCard } from '../TemplateCard';
import { IconComponent } from '@backstage/core-plugin-api';

/**
 * The props for the {@link TemplateGroup} component.
 * @alpha
 */
export interface TemplateGroupProps {
  templates: {
    template: TemplateEntityV1beta3;
    additionalLinks?: {
      icon: IconComponent;
      text: string;
      url: string;
    }[];
  }[];
  onSelected: (template: TemplateEntityV1beta3) => void;
  title: React.ReactNode;
  components?: {
    CardComponent?: React.ComponentType<TemplateCardProps>;
  };
}

/**
 * The `TemplateGroup` component is used to display a group of templates with a title.
 * @alpha
 */
export const TemplateGroup = (props: TemplateGroupProps) => {
  const {
    templates,
    title,
    components: { CardComponent } = {},
    onSelected,
  } = props;
  const titleComponent =
    typeof title === 'string' ? <ContentHeader title={title} /> : title;

  if (templates.length === 0) {
    return (
      <Content>
        {titleComponent}
        <Typography variant="body2">
          No templates found that match your filter. Learn more about{' '}
          <Link to="https://backstage.io/docs/features/software-templates/adding-templates">
            adding templates
          </Link>
          .
        </Typography>
      </Content>
    );
  }

  const Card = CardComponent || TemplateCard;

  return (
    <Content>
      {titleComponent}
      <ItemCardGrid>
        {templates.map(({ template, additionalLinks }) => (
          <Card
            key={stringifyEntityRef(template)}
            additionalLinks={additionalLinks}
            template={template}
            onSelected={onSelected}
          />
        ))}
      </ItemCardGrid>
    </Content>
  );
};
