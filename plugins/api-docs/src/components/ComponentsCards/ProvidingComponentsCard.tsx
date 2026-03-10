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

import { RELATION_API_PROVIDED_BY } from '@backstage/catalog-model';

import {
  EntityRelationCard,
  EntityColumnConfig,
  componentColumnConfig,
} from '@backstage/plugin-catalog-react';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { apiDocsTranslationRef } from '../../translation';

/** @public */
export const ProvidingComponentsCard = (props: {
  title?: string;
  columnConfig?: EntityColumnConfig[];
}) => {
  const { t } = useTranslationRef(apiDocsTranslationRef);
  const {
    title = t('providingComponentsCard.title'),
    columnConfig = componentColumnConfig,
  } = props;

  return (
    <EntityRelationCard
      title={title}
      relationType={RELATION_API_PROVIDED_BY}
      columnConfig={columnConfig}
      emptyState={{
        message: t('providingComponentsCard.emptyContent.title'),
        helpLink:
          'https://backstage.io/docs/features/software-catalog/descriptor-format#specprovidesapis-optional',
      }}
    />
  );
};
