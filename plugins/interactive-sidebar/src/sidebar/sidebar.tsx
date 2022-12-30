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

import React, {
  ComponentType,
  PropsWithChildren,
  useCallback,
  useState,
} from 'react';

import { ThemeProvider, Button, useTheme } from '@material-ui/core';
import HomeOutlined from '@material-ui/icons/HomeOutlined';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import {
  SidebarPinStateContext,
  SidebarContext,
} from '@backstage/core-components';
import {
  SidebarProvider,
  useSidebarRoot,
  BackstageTheme,
  combineClasses,
} from '@backstage/plugin-interactive-drawers';

import { Bookmarks } from './bookmarks';
import { PopOverFab } from './components/popover-fab';
import { useBookmarks } from './hooks/bookmarks';
import { SearchFab } from './plugins/search/fab';
import { Section } from './section';
import { useStyles } from './styles';
import { AddBookmarkFolder } from './top-items/add-bookmark-folder';
import { AppsFab } from './top-items/apps/fab';
import { TopItemFab } from './top-items/fab';
import { getTheme } from './colors';
import { LocationChangeDetection } from './location-change-detection';

const SidebarStyled = ({
  children,
  collapsed,
}: React.PropsWithChildren<{ collapsed: Boolean }>) => {
  const { drawer, drawerOpened } = useStyles(collapsed);
  const { interactiveDrawers } = useSidebarRoot();
  return (
    <div
      className={combineClasses(
        drawer,
        interactiveDrawers?.[0]?.content ? drawerOpened : '',
      )}
    >
      {children}
    </div>
  );
};

function SidebarEdit({ toggleEditMode }: { toggleEditMode: () => void }) {
  const { sidebarEditSection } = useStyles();
  return (
    <div className={sidebarEditSection}>
      <PopOverFab
        fab={Button}
        variant="outlined"
        content={AddBookmarkFolder}
        children={<>Add Folder</>}
        popOverDirection="top-right"
      />
      <Button color="primary" variant="outlined" onClick={toggleEditMode}>
        Done
      </Button>
    </div>
  );
}

function BookmarksHolder({
  toggleEditMode,
  editMode,
}: {
  toggleEditMode: () => void;
  editMode: boolean;
}) {
  const { scrollableBookmarkList } = useStyles();

  return (
    <div className={scrollableBookmarkList}>
      <Bookmarks toggleEditMode={toggleEditMode} editMode={editMode} />
    </div>
  );
}

function useDarkMode() {
  const theme = useTheme<BackstageTheme>();
  return theme.palette.type === 'dark';
}

// TODO: Rename and rethink theming
export const ThemedSidebarProvider = ({ children }: PropsWithChildren<{}>) => {
  const dark = useDarkMode();

  // const darkMode = featureFlags.getItem('dark-theme');
  const theme = getTheme(dark);

  return (
    <SidebarProvider>
      <ThemeProvider theme={theme} children={children} />
    </SidebarProvider>
  );
};

export interface WrapperComponentProps {
  onClick: () => void;
  children?: string;
  title?: string;
  icon: React.ReactElement;
}

export interface SidebarProps {
  MoreMenu?: ComponentType<PropsWithChildren<{}>>;
  LoggedIn: ComponentType<{
    WrapperComponent: ComponentType<PropsWithChildren<WrapperComponentProps>>;
  }>;
}

export const Sidebar = (props: PropsWithChildren<SidebarProps>) => {
  const { MoreMenu, LoggedIn, children } = props;

  const [editMode, setEditMode] = useState(false);
  const { moveBookmark } = useBookmarks();

  const toggleEditMode = useCallback(
    () => setEditMode(mode => !mode),
    [setEditMode],
  );

  const onDragEnd = (result: DropResult) => {
    moveBookmark({
      from: {
        folderIndex: parseInt(result.source.droppableId, 10),
        bookmarkIndex: result.source.index,
      },
      to: {
        folderIndex: parseInt(result.destination!.droppableId, 10),
        bookmarkIndex: result.destination!.index,
      },
    });
  };

  const wrapDragDropContext = (content: JSX.Element) =>
    !editMode ? (
      content
    ) : (
      <DragDropContext onDragEnd={onDragEnd}>{content}</DragDropContext>
    );

  return wrapDragDropContext(
    <SidebarPinStateContext.Provider
      value={{ isPinned: true, toggleSidebarPinState: () => {} }}
    >
      <SidebarContext.Provider value={{ isOpen: true, setOpen(_open) {} }}>
        <LocationChangeDetection />
        <SidebarStyled collapsed={false}>
          <Section>
            <TopItemFab icon={<HomeOutlined />} title="Home" to="/" />
            <AppsFab />
            <SearchFab />
            <LoggedIn WrapperComponent={TopItemFab} />
            {MoreMenu && (
              <MoreMenu>
                <TopItemFab icon={<MoreHorizIcon />} title="More" />
              </MoreMenu>
            )}
          </Section>

          {children ?? null}

          <BookmarksHolder
            toggleEditMode={toggleEditMode}
            editMode={editMode}
          />

          {!editMode ? null : <SidebarEdit toggleEditMode={toggleEditMode} />}
        </SidebarStyled>
      </SidebarContext.Provider>
    </SidebarPinStateContext.Provider>,
  );
};
