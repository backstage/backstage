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

import React from 'react';

import { combineClasses } from '@backstage/plugin-interactive-drawers';

import { makeStyles } from '@material-ui/core';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import { useBookmarks } from './hooks/bookmarks';
import { BookmarkItem } from './pinned-items/bookmark-item';
import { Section, Header } from './section';

const useStyles = makeStyles(() => ({
  sectionDroppable: {},
  droppableSectionList: {
    border: '1px dashed green',
    minHeight: 20,
  },
  sectionListCollapsed: {
    display: 'none',
  },
}));

export function Bookmarks({
  toggleEditMode,
  editMode,
}: {
  toggleEditMode: () => void;
  editMode: boolean;
}) {
  const { bookmarks, toggleCollapseFolder } = useBookmarks();
  const { droppableSectionList, sectionListCollapsed } = useStyles();

  const wrapDraggable = (children: JSX.Element, key: string, index: number) =>
    !editMode ? (
      children
    ) : (
      <Draggable key={key} draggableId={key} index={index}>
        {provided => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {children}
          </div>
        )}
      </Draggable>
    );

  const wrapDroppable = (children: JSX.Element, key: string, index: number) =>
    !editMode ? (
      children
    ) : (
      <Droppable {...(key && { key })} droppableId={`${index}`}>
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );

  return (
    <div>
      {bookmarks.folders.map((folder, folderIndex) =>
        wrapDroppable(
          <Section
            key={`${folder.name}\$${folderIndex}`}
            droppable={editMode}
            collapsed={folder.collapsed}
          >
            <Header
              index={folderIndex}
              collapsed={folder.collapsed}
              toggleEditMode={toggleEditMode}
              editMode={editMode}
              onClick={toggleCollapseFolder}
            >
              {folder.name}
            </Header>
            <div
              className={combineClasses(
                editMode ? droppableSectionList : '',
                folder.collapsed ? sectionListCollapsed : '',
              )}
            >
              {folder.bookmarks.map((bookmark, bookmarkIndex) =>
                wrapDraggable(
                  bookmark.type === 'external' ? (
                    <BookmarkItem
                      folderIndex={folderIndex}
                      bookmarkIndex={bookmarkIndex}
                      editMode={editMode}
                      key={`${bookmarkIndex} ${bookmark.url}`}
                      type="external"
                      title={bookmark.title}
                      to={bookmark.url}
                    />
                  ) : (
                    <BookmarkItem
                      folderIndex={folderIndex}
                      bookmarkIndex={bookmarkIndex}
                      disableDrawerAction={editMode}
                      key={`${bookmarkIndex} ${bookmark.path}`}
                      type="internal"
                      title={bookmark.title}
                      to={bookmark.path}
                    />
                  ),
                  `${bookmarkIndex} ${
                    (bookmark as any)?.url ?? (bookmark as any)?.path
                  }`,
                  bookmarkIndex,
                ),
              )}
            </div>
          </Section>,
          `${folder.name}\$${folderIndex}`,
          folderIndex,
        ),
      )}
    </div>
  );
}
