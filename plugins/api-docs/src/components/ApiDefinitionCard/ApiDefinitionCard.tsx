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

import { ApiEntity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { CardTab, TabbedCard } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import Alert from '@material-ui/lab/Alert';
import { apiDocsConfigRef } from '../../config';
import { apiDocsTranslationRef } from '../../translation';
import { PlainApiDefinitionWidget } from '../PlainApiDefinitionWidget';

/** @public */
export const ApiDefinitionCard = () => {
  const { entity } = useEntity<ApiEntity>();
  const config = useApi(apiDocsConfigRef);
  const { getApiDefinitionWidget } = config;
  const { t } = useTranslationRef(apiDocsTranslationRef);

  if (!entity) {
    return <Alert severity="error">{t('apiDefinitionCard.error.title')}</Alert>;
  }

  const definitionWidget = getApiDefinitionWidget(entity);
  const entityTitle = entity.metadata.title ?? entity.metadata.name;

  if (definitionWidget) {
    return (
      <TabbedCard title={entityTitle}>
        <CardTab label={definitionWidget.title} key="widget">
          {definitionWidget.component(entity.spec.definition)}
        </CardTab>
        <CardTab label={t('apiDefinitionCard.rawButtonTitle')} key="raw">
          <PlainApiDefinitionWidget
            definition={entity.spec.definition}
            language={definitionWidget.rawLanguage || entity.spec.type}
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
        <CardTab label={entity.spec.type} key="raw">
          <PlainApiDefinitionWidget
            definition={entity.spec.definition}
            language={entity.spec.type}
          />
        </CardTab>,
      ]}
    />
  );
};
