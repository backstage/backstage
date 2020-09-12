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

import { ApiEntity } from '@backstage/catalog-model';
import { TabbedCard, CardTab } from '@backstage/core';
import React from 'react';
import { PlainApiDefinitionWidget } from '../PlainApiDefinitionWidget';
import { Alert } from '@material-ui/lab';
import { OpenApiDefinitionWidget } from '../OpenApiDefinitionWidget';
import { AsyncApiDefinitionWidget } from '../AsyncApiDefinitionWidget';

type ApiDefinitionWidget = {
  type: string;
  title: string;
  component: (definition: string) => React.ReactElement;
  rawLanguage?: string;
};

export function defaultDefinitionWidgets(): ApiDefinitionWidget[] {
  return [
    {
      type: 'openapi',
      title: 'OpenAPI',
      rawLanguage: 'yaml',
      component: definition => (
        <OpenApiDefinitionWidget definition={definition} />
      ),
    },
    {
      type: 'asyncapi',
      title: 'AsyncAPI',
      rawLanguage: 'yaml',
      component: definition => (
        <AsyncApiDefinitionWidget definition={definition} />
      ),
    },
  ];
}

type Props = {
  apiEntity?: ApiEntity;
  definitionWidgets?: ApiDefinitionWidget[];
};

const defaultProps = {
  definitionWidgets: defaultDefinitionWidgets(),
};

export const ApiDefinitionCard = (props: Props) => {
  const { apiEntity, definitionWidgets } = {
    ...defaultProps,
    ...props,
  };

  if (!apiEntity) {
    return <Alert severity="error">Could not fetch the API</Alert>;
  }

  const definitionWidget = definitionWidgets.find(
    d => d.type === apiEntity.spec.type,
  );

  if (definitionWidget) {
    return (
      <TabbedCard title={apiEntity.metadata.name}>
        <CardTab label={definitionWidget.title}>
          {definitionWidget.component(apiEntity.spec.definition)}
        </CardTab>
        <CardTab label="Raw">
          <PlainApiDefinitionWidget
            definition={apiEntity.spec.definition}
            language={definitionWidget.rawLanguage || apiEntity.spec.type}
          />
        </CardTab>
      </TabbedCard>
    );
  }

  return (
    <TabbedCard
      title={apiEntity.metadata.name}
      children={[
        // Has to be an array, otherwise typescript doesn't like that this has only a single child
        <CardTab label={apiEntity.spec.type}>
          <PlainApiDefinitionWidget
            definition={apiEntity.spec.definition}
            language={apiEntity.spec.type}
          />
        </CardTab>,
      ]}
    />
  );
};
