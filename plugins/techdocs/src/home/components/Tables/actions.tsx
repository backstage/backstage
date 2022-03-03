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

import React from 'react';
import ShareIcon from '@material-ui/icons/Share';
import { DocsTableRow } from './types';
import { withStyles } from '@material-ui/styles';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';

const YellowStar = withStyles({
  root: {
    color: '#f3ba37',
  },
})(Star);

/**
 * Not directly exported, but through DocsTable.actions and EntityListDocsTable.actions
 *
 * @public
 */
export const actionFactories = {
  createCopyDocsUrlAction(copyToClipboard: Function) {
    return (row: DocsTableRow) => {
      return {
        icon: () => <ShareIcon fontSize="small" />,
        tooltip: 'Click to copy documentation link to clipboard',
        onClick: () =>
          copyToClipboard(`${window.location.origin}${row.resolved.docsUrl}`),
      };
    };
  },
  createStarEntityAction(
    isStarredEntity: Function,
    toggleStarredEntity: Function,
  ) {
    return ({ entity }: DocsTableRow) => {
      const isStarred = isStarredEntity(entity);
      return {
        cellStyle: { paddingLeft: '1em' },
        icon: () => (isStarred ? <YellowStar /> : <StarBorder />),
        tooltip: isStarred ? 'Remove from favorites' : 'Add to favorites',
        onClick: () => toggleStarredEntity(entity),
      };
    };
  },
};
