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

import { RELATION_HAS_PART, SystemEntity } from '@backstage/catalog-model';
import {
  InfoCardVariants,
  TableColumn,
  TableOptions,
} from '@backstage/core-components';
import {
  asSystemEntities,
  RelatedEntitiesCard,
  systemEntityColumns,
  systemEntityHelpLink,
} from '../RelatedEntitiesCard';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @public */
export interface HasSystemsCardProps {
  variant?: InfoCardVariants;
  title?: string;
  columns?: TableColumn<SystemEntity>[];
  tableOptions?: TableOptions;
}

export function HasSystemsCard(props: HasSystemsCardProps) {
  const { t } = useTranslationRef(catalogTranslationRef);
  const {
    variant = 'gridItem',
    title = t('hasSystemsCard.title'),
    columns = systemEntityColumns,
    tableOptions = {},
  } = props;
  return (
    <RelatedEntitiesCard
      variant={variant}
      title={title}
      entityKind="System"
      relationType={RELATION_HAS_PART}
      columns={columns}
      asRenderableEntities={asSystemEntities}
      emptyMessage={t('hasSystemsCard.emptyMessage')}
      emptyHelpLink={systemEntityHelpLink}
      tableOptions={tableOptions}
    />
  );
}
