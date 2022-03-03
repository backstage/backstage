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
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { Card } from '@material-ui/core';
import { CardHeader } from './CardHeader';
/**
 * The Props for the Template Card component
 * @public
 */
export interface TemplateCardProps {
  template: TemplateEntityV1beta3;
  deprecated?: boolean;
}

/**
 * The Template Card component that is rendered in a list for each template
 * @public
 */
export const TemplateCard = (props: TemplateCardProps) => {
  const { template } = props;
  return (
    <Card>
      <CardHeader
        type={template.spec.type}
        title={template.metadata.title ?? template.metadata.name}
      />
    </Card>
  );
};
