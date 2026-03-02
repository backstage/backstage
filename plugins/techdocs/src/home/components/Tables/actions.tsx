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

import { Share } from 'lucide-react';
import { DocsTableRow } from './types';
import { FavoriteToggleIcon } from '@backstage/core-components';

/**
 * Not directly exported, but through DocsTable.actions and EntityListDocsTable.actions
 *
 * @public
 */
export const actionFactories = {
  createCopyDocsUrlAction(copyToClipboard: Function) {
    return {
      icon: () => <Share className="h-4 w-4" />,
      tooltip: 'Click to copy documentation link to clipboard',
      onClick: (_event: any, row: DocsTableRow | DocsTableRow[]) => {
        const data = Array.isArray(row) ? row[0] : row;
        copyToClipboard(`${window.location.origin}${data.resolved.docsUrl}`);
      },
    };
  },
  createStarEntityAction(
    _isStarredEntity: Function,
    toggleStarredEntity: Function,
  ) {
    return {
      cellStyle: { paddingLeft: '1em' },
      icon: () => <FavoriteToggleIcon isFavorite={false} />,
      tooltip: 'Toggle favorite',
      onClick: (_event: any, row: DocsTableRow | DocsTableRow[]) => {
        const data = Array.isArray(row) ? row[0] : row;
        toggleStarredEntity(data.entity);
      },
    };
  },
};
