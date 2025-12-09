/*
 * Copyright 2021 The Backstage Authors
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

import ShareIcon from '@material-ui/icons/Share';
import { DocsTableRow } from './types';
import { FavoriteToggleIcon } from '@backstage/core-components';
import type { TranslationFunction } from '@backstage/core-plugin-api/alpha';
import type { techdocsTranslationRef } from '../../../translation';

type InternalTranslationFunctionType = TranslationFunction<
  typeof techdocsTranslationRef extends { T: infer T } ? T : never
>;

/**
 * Not directly exported, but through DocsTable.actions and EntityListDocsTable.actions
 *
 * @public
 */
export const actionFactories = {
  createCopyDocsUrlAction(
    copyToClipboard: Function,
    t: InternalTranslationFunctionType,
  ) {
    return (row: DocsTableRow) => {
      return {
        icon: () => <ShareIcon fontSize="small" />,
        tooltip: t('table.actions.copyDocsUrl', {}),
        onClick: () =>
          copyToClipboard(`${window.location.origin}${row.resolved.docsUrl}`),
      };
    };
  },
  createStarEntityAction(
    isStarredEntity: Function,
    toggleStarredEntity: Function,
    t: InternalTranslationFunctionType,
  ) {
    return (row: DocsTableRow) => {
      const entity = row.entity;
      const isStarred = isStarredEntity(entity);
      const tooltip = isStarred
        ? t('table.actions.removeFromFavorites', {})
        : t('table.actions.addToFavorites', {});
      return {
        cellStyle: { paddingLeft: '1em' },
        icon: () => <FavoriteToggleIcon isFavorite={isStarred} />,
        tooltip,
        onClick: () => toggleStarredEntity(entity),
      };
    };
  },
};
