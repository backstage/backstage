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

import React, { useCallback, useMemo, useState } from 'react';

import {
  BackstageTheme,
  combineClasses,
  useStyles as useGenericStyles,
} from '@backstage/plugin-interactive-drawers';

import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  MenuItem,
  MenuList,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

import { HeaderFab } from './components/header-fab';
import { PopOverFab, PopOverFabContentProps } from './components/popover-fab';
import { useBookmarks } from './hooks/bookmarks';
import { AddBookmark } from './top-items/add-bookmark';

// Contribute back to BOSS
const useStyles = makeStyles<BackstageTheme>(theme => ({
  section: {
    userSelect: 'none',
    paddingTop: 8,
    paddingBottom: 8,
    '&:first-child': {
      paddingTop: 16,
    },
  },
  headerStyle: {
    height: 28,
    display: 'flex',
    paddingLeft: 6,
    fontWeight: 'normal',
    '&:hover': {
      backgroundColor: theme.sidebarSelectableBackgroundColor,
    },
    '& > :nth-child(1)': {
      flex: '0 0 auto',
    },
    '& > :nth-child(2)': {
      flex: '1 0 auto',
    },
    '& > :nth-child(3)': {
      flex: '0 0 auto',
    },
    '&:hover > div > $addButton': {
      display: 'initial',
    },
  },
  headerArrowSvg: {
    verticalAlign: 'middle',
  },
  addButton: {
    verticalAlign: 'top',
  },
}));

export interface HeaderProps {
  index: number;
  toggleEditMode: () => void;
  editMode: boolean;
  onClick?: (index: number) => void;
  collapsed?: boolean;
}

export const Header = ({
  index,
  toggleEditMode,
  editMode,
  onClick,
  collapsed,
  children,
}: React.PropsWithChildren<HeaderProps>) => {
  const { coreItem, pinnedItemStyle } = useGenericStyles();
  const { headerStyle, headerArrowSvg, addButton } = useStyles();

  const {
    isPageBookmarkedInFolder,
    toggleBookmarkInFolder,
    bookmarks,
    deleteBookmarkFolder,
  } = useBookmarks();

  const [alertDeleteOpen, setAlertDeleteOpen] = useState(false);
  const closeDeleteDialog = useCallback(() => {
    setAlertDeleteOpen(false);
  }, [setAlertDeleteOpen]);
  const doDelete = useCallback(() => {
    deleteBookmarkFolder(index);
    closeDeleteDialog();
  }, [index, deleteBookmarkFolder, closeDeleteDialog]);
  const maybeOpenDeleteDialog = useCallback(() => {
    if (bookmarks.folders[index].bookmarks.length === 0) {
      // Empty folder, just delete
      doDelete();
    } else {
      setAlertDeleteOpen(true);
    }
  }, [bookmarks, index, doDelete, setAlertDeleteOpen]);

  const handleClick = useCallback(() => {
    onClick?.(index);
  }, [index, onClick]);

  const isPageBookmarked = isPageBookmarkedInFolder(index);
  const toggleBookmarkThis = useCallback(() => {
    toggleBookmarkInFolder(index);
  }, [toggleBookmarkInFolder, index]);

  const deleteDisabled = !!bookmarks.folders[index].default;

  const addExternalBookmarkProps = useMemo(
    () => ({ folderIndex: index }),
    [index],
  );

  const moreProps = useMemo(
    () => ({
      toggleEditMode,
      deleteFolder: maybeOpenDeleteDialog,
      deleteDisabled,
    }),
    [toggleEditMode, maybeOpenDeleteDialog, deleteDisabled],
  );

  return (
    <div className={combineClasses(coreItem, pinnedItemStyle, headerStyle)}>
      {/* eslint-disable-next-line */}
      <div onClick={handleClick}>
        {!collapsed ? (
          <ArrowDropDownIcon className={headerArrowSvg} />
        ) : (
          <ArrowRightIcon className={headerArrowSvg} />
        )}
      </div>
      {/* eslint-disable-next-line */}
      <div onClick={handleClick}>{children}</div>
      {editMode ? null : (
        <div>
          <PopOverFab
            icon={<MoreVertIcon />}
            title="More"
            className={addButton}
            fab={HeaderFab}
            content={More}
            contentProps={moreProps}
          />
          <PopOverFab
            icon={<PlaylistAddIcon />}
            title="Bookmark external page"
            className={addButton}
            fab={HeaderFab}
            content={AddBookmark}
            contentProps={addExternalBookmarkProps}
          />
          <HeaderFab
            className={addButton}
            icon={
              isPageBookmarked ? (
                <BookmarkIcon key="bookmark" />
              ) : (
                <BookmarkBorderIcon key="unbookmark" />
              )
            }
            title={
              isPageBookmarked
                ? 'Remove this page from the bookmarks'
                : 'Bookmark this page'
            }
            onClick={toggleBookmarkThis}
          />
          <Dialog open={alertDeleteOpen} onClose={closeDeleteDialog}>
            <DialogTitle>Delete folder "{children}"</DialogTitle>
            <DialogContent>
              <DialogContentText>
                This will delete the {bookmarks.folders[index].bookmarks.length}{' '}
                bookmarks in this folder too
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDeleteDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={doDelete} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export interface SectionProps {
  collapsed?: boolean;
  droppable?: boolean;
}

export function Section({ children }: React.PropsWithChildren<SectionProps>) {
  const { section } = useStyles();
  return <div className={section}>{children}</div>;
}

interface MoreProps {
  toggleEditMode: () => void;
  deleteFolder: () => void;
  deleteDisabled: boolean;
}

function More({
  toggleEditMode,
  deleteFolder,
  deleteDisabled,
  close,
}: PopOverFabContentProps<MoreProps>) {
  const clickToggleEdit = useCallback(() => {
    toggleEditMode();
    close();
  }, [toggleEditMode, close]);

  const clickDelete = useCallback(() => {
    deleteFolder();
    close();
  }, [deleteFolder, close]);

  return (
    <MenuList>
      <MenuItem value="edit" onClick={clickToggleEdit}>
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <ListItemText primary="Edit sidebar" />
      </MenuItem>
      {deleteDisabled ? null : (
        <MenuItem value="delete" onClick={clickDelete}>
          <ListItemIcon>
            <DeleteOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="Delete folder" />
        </MenuItem>
      )}
    </MenuList>
  );
}
