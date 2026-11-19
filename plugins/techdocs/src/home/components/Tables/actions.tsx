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
import Typography from '@material-ui/core/Typography';
import { CSSProperties } from 'react';
import { DocsTableRow } from './types';
import { FavoriteToggleIcon } from '@backstage/core-components';
import type { TranslationFunction } from '@backstage/core-plugin-api/alpha';
import type { techdocsTranslationRef } from '../../../translation';

type InternalTranslationFunctionType = TranslationFunction<
  typeof techdocsTranslationRef extends { T: infer T } ? T : never
>;

// Matches the visually-hidden pattern used by CatalogTable action icons so
// material-table IconButtons get an accessible name from their content.
const visuallyHidden: CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
};

function entityLabel(row: DocsTableRow): string {
  return row.entity.metadata.title || row.entity.metadata.name;
}

/**
 * Not directly exported, but through DocsTable.actions and EntityListDocsTable.actions
 *
 * @public
 */
export const actionFactories = {
  createCopyDocsUrlAction(
    copyToClipboard: Function,
    t?: InternalTranslationFunctionType,
  ) {
    return (row: DocsTableRow) => {
      const name = entityLabel(row);
      const tooltip =
        t?.('table.actions.copyDocsUrl', { entityName: name }) ??
        `Copy link to ${name} documentation`;
      return {
        icon: () => (
          <>
            <Typography style={visuallyHidden}>{tooltip}</Typography>
            <ShareIcon fontSize="small" />
          </>
        ),
        tooltip,
        onClick: () =>
          copyToClipboard(`${window.location.origin}${row.resolved.docsUrl}`),
      };
    };
  },
  createStarEntityAction(
    isStarredEntity: Function,
    toggleStarredEntity: Function,
    t?: InternalTranslationFunctionType,
  ) {
    return (row: DocsTableRow) => {
      const entity = row.entity;
      const name = entityLabel(row);
      const isStarred = isStarredEntity(entity);
      const tooltip = isStarred
        ? t?.('table.actions.removeFromFavorites', { entityName: name }) ??
          `Remove ${name} from favorites`
        : t?.('table.actions.addToFavorites', { entityName: name }) ??
          `Add ${name} to favorites`;
      return {
        cellStyle: { paddingLeft: '1em' },
        icon: () => (
          <>
            <Typography style={visuallyHidden}>{tooltip}</Typography>
            <FavoriteToggleIcon isFavorite={isStarred} />
          </>
        ),
        tooltip,
        onClick: () => toggleStarredEntity(entity),
      };
    };
  },
};
