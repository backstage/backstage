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
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { apiDocsConfigRef } from '../../config';
import { PlainApiDefinitionWidget } from '../PlainApiDefinitionWidget';

import { CardTab, TabbedCard } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { DefaultApiEntityWidgetCustomizer } from './DefaultApiEntityWidgetCustomizer';

/** @public */
export type ApiDefinitionWidgetCustomization = {
  props: Record<string, any>;
};

/** @public */
export type ApiDefinitionWidgetCustomizer = (
  entity: ApiEntity,
  current: ApiDefinitionWidgetCustomization,
) => ApiDefinitionWidgetCustomization;

/** @public */
export type ApiDefinitionCardProps = {
  customizers?: ApiDefinitionWidgetCustomizer[];
};

/** @public */
export const ApiDefinitionCard = ({ customizers }: ApiDefinitionCardProps) => {
  const { entity } = useEntity<ApiEntity>();
  const config = useApi(apiDocsConfigRef);
  const { getApiDefinitionWidget } = config;
  const [customProps, setCustomProps] = useState({});

  useEffect(() => {
    const start: ApiDefinitionWidgetCustomization = {
      props: {
        // this is primarily to workaround the current state of Swagger UI where some props (specifically plugins)
        // are only respected on mount. See https://github.com/swagger-api/swagger-ui/tree/master/flavors/swagger-ui-react
        key: `${entity.metadata.uid || 'default'}_${
          entity.metadata.etag || 'default'
        }`,
      },
    };
    const reducedCustomizations = [
      DefaultApiEntityWidgetCustomizer,
      ...(customizers || []),
    ].reduce((acc, current) => {
      return current(entity, acc);
    }, start);

    setCustomProps(reducedCustomizations.props);
  }, [entity, customizers]);

  if (!entity) {
    return <Alert severity="error">Could not fetch the API</Alert>;
  }

  const definitionWidget = getApiDefinitionWidget(entity);
  const entityTitle = entity.metadata.title ?? entity.metadata.name;

  if (definitionWidget) {
    return (
      <TabbedCard title={entityTitle}>
        <CardTab label={definitionWidget.title} key="widget">
          {definitionWidget.component(entity.spec.definition, customProps)}
        </CardTab>
        <CardTab label="Raw" key="raw">
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
