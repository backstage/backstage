/*
 * Copyright 2020 The Backstage Authors
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

import { ApiEntity, ApiEntityV1alpha1 } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { CardTab, TabbedCard } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import { apiDocsConfigRef } from '../../config';
import { apiDocsTranslationRef } from '../../translation';
import { PlainApiDefinitionWidget } from '../PlainApiDefinitionWidget';

function ApiDefinitionCardEmpty(props: { title: string; message: string }) {
  return (
    <TabbedCard
      title={props.title}
      children={[
        <CardTab label="" key="empty">
          <Typography variant="body2">{props.message}</Typography>
        </CardTab>,
      ]}
    />
  );
}

/** @public */
export const ApiDefinitionCard = () => {
  const { entity } = useEntity<ApiEntity>();
  const config = useApi(apiDocsConfigRef);
  const { getApiDefinitionWidget } = config;
  const { t } = useTranslationRef(apiDocsTranslationRef);

  if (!entity) {
    return <Alert severity="error">{t('apiDefinitionCard.error.title')}</Alert>;
  }

  const entityTitle = entity.metadata.title ?? entity.metadata.name;

  if (
    entity.apiVersion === 'backstage.io/v1alpha2' &&
    entity.spec.type === 'mcp-server'
  ) {
    return (
      <ApiDefinitionCardEmpty
        title={entityTitle}
        message={t('apiDefinitionCard.noDefinition.title')}
      />
    );
  }

  const apiEntity = entity as ApiEntityV1alpha1;
  const definitionWidget = getApiDefinitionWidget(apiEntity);

  if (definitionWidget) {
    return (
      <TabbedCard title={entityTitle}>
        <CardTab label={definitionWidget.title} key="widget">
          {definitionWidget.component(apiEntity.spec.definition)}
        </CardTab>
        <CardTab label={t('apiDefinitionCard.rawButtonTitle')} key="raw">
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
      title={entityTitle}
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
