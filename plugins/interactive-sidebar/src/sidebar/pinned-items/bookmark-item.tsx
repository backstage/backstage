/*
 * Copyright 2022 The Backstage Authors
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

import {
  InteractiveLink,
  InteractiveLinkProps,
} from '@backstage/plugin-interactive-drawers';
import React, { useCallback } from 'react';

import { useBookmarks } from '../hooks/bookmarks';

import { ExternalPinnedItem, ExternalPinnedItemProps } from './external-item';

import { makeSidebarItemProps } from './sidebar-item-props';

export interface TopLevelItemProps {
  folderIndex: number;
  bookmarkIndex: number;
}

export type InternalPinnedItemProps = InteractiveLinkProps & {
  type: 'internal';
};

export type BookmarkItemProps = TopLevelItemProps &
  (
    | ({ type: 'external' } & Omit<ExternalPinnedItemProps, 'deleteBookmark'>)
    | InternalPinnedItemProps
  );

export function BookmarkItem({
  folderIndex,
  bookmarkIndex,
  ...props
}: BookmarkItemProps) {
  const { deleteExternalBookmark } = useBookmarks();

  const deleteBookmark = useCallback(
    (ev?: React.MouseEvent<HTMLElement>) => {
      ev?.preventDefault();
      deleteExternalBookmark(folderIndex, bookmarkIndex);
    },
    [deleteExternalBookmark, folderIndex, bookmarkIndex],
  );

  if (props.type === 'external') {
    return <ExternalPinnedItem {...props} deleteBookmark={deleteBookmark} />;
  }

  const actionProps = makeSidebarItemProps(
    !!props.disableDrawerAction,
    deleteBookmark,
  );

  return <InteractiveLink {...props} {...actionProps} />;
}
