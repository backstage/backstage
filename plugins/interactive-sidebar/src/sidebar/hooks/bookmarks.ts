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

import { useCurrentCleanPath } from '@backstage/plugin-interactive-drawers';
import { useCallback } from 'react';

import createPersistedState from 'use-persisted-state';

const useBookmarksState = createPersistedState<Bookmarks>('bs-hack-bookmarks');

export interface InternalBookmark {
  type: 'internal';
  path: string;
  title: string;
}

export interface ExternalBookmark {
  type: 'external';
  url: string;
  title: string;
}

export type Bookmark = InternalBookmark | ExternalBookmark;

export interface BookmarkFolder {
  default?: true;
  collapsed?: boolean;
  name: string;
  bookmarks: Bookmark[];
}

export interface Bookmarks {
  folders: BookmarkFolder[];
}

export interface MoveBookmark {
  from: { folderIndex: number; bookmarkIndex: number };
  to: { folderIndex: number; bookmarkIndex: number };
}

export interface UseBookmarksResult {
  bookmarks: Bookmarks;
  moveBookmark: (move: MoveBookmark) => void;
  toggleBookmarkThis: () => void;
  toggleBookmarkInFolder: (folderIndex: number) => void;
  isPageBookmarkedInFolder: (folderIndex: number) => boolean;
  isPageBookmarked: boolean;
  addExternalBookmark: (
    url: string,
    title: string,
    folderIndex?: number,
  ) => void;
  deleteExternalBookmark: (folderIndex: number, bookmarkIndex: number) => void;
  addBookmarkFolder: (name: string) => void;
  deleteBookmarkFolder: (index: number) => void;
  toggleCollapseFolder: (index: number) => void;
}

const initialBookmarks: Bookmarks = {
  folders: [{ default: true, name: 'General', bookmarks: [] }],
};

export function useBookmarks(): UseBookmarksResult {
  const [bookmarks, setBookmarks] = useBookmarksState(initialBookmarks);
  const path = useCurrentCleanPath();

  const flatBookmarks = bookmarks.folders.flatMap(folder => folder.bookmarks);

  const isPageBookmarked = flatBookmarks.some(
    bookmark => bookmark.type === 'internal' && bookmark.path === path,
  );

  const toggleBookmarkThis = useCallback(() => {
    const found = bookmarks.folders.some(folder => {
      const index = folder.bookmarks.findIndex(
        bookmark => bookmark.type === 'internal' && bookmark.path === path,
      );
      if (index === -1) {
        return false;
      }
      folder.bookmarks.splice(index, 1);
      return true;
    });
    if (!found) {
      bookmarks.folders[0].bookmarks.push({
        type: 'internal',
        path: path,
        title: document.title,
      });
    }

    setBookmarks({ ...bookmarks });
  }, [bookmarks, setBookmarks, path]);

  const toggleBookmarkInFolder = useCallback(
    (folderIndex: number) => {
      const folder = bookmarks.folders[folderIndex];

      const index = folder.bookmarks.findIndex(
        bookmark => bookmark.type === 'internal' && bookmark.path === path,
      );
      if (index === -1) {
        bookmarks.folders[folderIndex].bookmarks.push({
          type: 'internal',
          path: path,
          title: document.title,
        });
      } else {
        folder.bookmarks.splice(index, 1);
      }

      setBookmarks({ ...bookmarks });
    },
    [bookmarks, setBookmarks, path],
  );

  const isPageBookmarkedInFolder = useCallback(
    (folderIndex: number) => {
      return bookmarks.folders[folderIndex].bookmarks.some(
        bookmark => bookmark.type === 'internal' && bookmark.path === path,
      );
    },
    [bookmarks, path],
  );

  const addExternalBookmark = useCallback(
    (url: string, title: string, folderIndex?: number) => {
      bookmarks.folders[folderIndex ?? 0].bookmarks.push({
        type: 'external',
        url,
        title: title,
      });
      setBookmarks({ ...bookmarks });
    },
    [bookmarks, setBookmarks],
  );

  const deleteExternalBookmark = useCallback(
    (folderIndex: number, bookmarkIndex: number) => {
      bookmarks.folders[folderIndex].bookmarks.splice(bookmarkIndex, 1);
      setBookmarks({ ...bookmarks });
    },
    [bookmarks, setBookmarks],
  );

  const addBookmarkFolder = useCallback(
    (name: string) => {
      bookmarks.folders.push({ name, bookmarks: [] });
      setBookmarks({ ...bookmarks });
    },
    [bookmarks, setBookmarks],
  );

  const deleteBookmarkFolder = useCallback(
    (index: number) => {
      bookmarks.folders.splice(index, 1);
      setBookmarks({ ...bookmarks });
    },
    [bookmarks, setBookmarks],
  );

  const moveBookmark = useCallback(
    (move: MoveBookmark) => {
      const [bookmark] = bookmarks.folders[
        move.from.folderIndex
      ].bookmarks.splice(move.from.bookmarkIndex, 1);
      bookmarks.folders[move.to.folderIndex].bookmarks.splice(
        move.to.bookmarkIndex,
        0,
        bookmark,
      );
      setBookmarks({ ...bookmarks });
    },
    [bookmarks, setBookmarks],
  );

  const toggleCollapseFolder = useCallback(
    (index: number) => {
      bookmarks.folders[index].collapsed = !bookmarks.folders[index].collapsed;
      setBookmarks({ ...bookmarks });
    },
    [bookmarks, setBookmarks],
  );

  return {
    bookmarks,
    moveBookmark,
    toggleBookmarkThis,
    toggleBookmarkInFolder,
    isPageBookmarkedInFolder,
    isPageBookmarked,
    addExternalBookmark,
    deleteExternalBookmark,
    addBookmarkFolder,
    deleteBookmarkFolder,
    toggleCollapseFolder,
  };
}
