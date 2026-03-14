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

import { RELATION_HAS_PART } from '@backstage/catalog-model';

import {
  EntityRelationCard,
  EntityColumnConfig,
  domainColumnConfig,
  domainEntityHelpLink,
} from '@backstage/plugin-catalog-react';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @public */
export interface HasSubdomainsCardProps {
  title?: string;
  columnConfig?: EntityColumnConfig[];
}

export function HasSubdomainsCard(props: HasSubdomainsCardProps) {
  const { t } = useTranslationRef(catalogTranslationRef);
  const {
    title = t('hasSubdomainsCard.title'),
    columnConfig = domainColumnConfig,
  } = props;
  return (
    <EntityRelationCard
      title={title}
      entityKind="Domain"
      relationType={RELATION_HAS_PART}
      columnConfig={columnConfig}
      emptyState={{
        message: t('hasSubdomainsCard.emptyMessage'),
        helpLink: domainEntityHelpLink,
      }}
    />
  );
}
