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
import { CardTab, TabbedCard, useApi } from '@backstage/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { apiDocsConfigRef } from '../../config';
import { PlainApiDefinitionWidget } from '../PlainApiDefinitionWidget';

type Props = {
  apiEntity?: ApiEntity;
};

export const ApiDefinitionCard = ({ apiEntity }: Props) => {
  const config = useApi(apiDocsConfigRef);
  const { getApiDefinitionWidget } = config;

  if (!apiEntity) {
    return <Alert severity="error">Could not fetch the API</Alert>;
  }

  const definitionWidget = getApiDefinitionWidget(apiEntity);

  if (definitionWidget) {
    return (
      <TabbedCard title={apiEntity.metadata.name}>
        <CardTab label={definitionWidget.title} key="widget">
          {definitionWidget.component(apiEntity.spec.definition)}
        </CardTab>
        <CardTab label="Raw" key="raw">
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
        <CardTab label={apiEntity.spec.type} key="raw">
          <PlainApiDefinitionWidget
            definition={apiEntity.spec.definition}
            language={apiEntity.spec.type}
          />
        </CardTab>,
      ]}
    />
  );
};
