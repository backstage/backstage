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

import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { ResponseErrorPanel } from '@backstage/core-components';
import { alertApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  humanizeEntityRef,
  useAsyncEntity,
} from '@backstage/plugin-catalog-react';
import { usePermission } from '@backstage/plugin-permission-react';
import {
  permissions,
  Playlist,
  PlaylistMetadata,
} from '@backstage/plugin-playlist-common';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  TextField,
} from '@material-ui/core';
import ClearButton from '@material-ui/icons/Clear';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import SearchIcon from '@material-ui/icons/Search';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAsyncFn from 'react-use/lib/useAsyncFn';

import { playlistApiRef } from '../../api';
import { playlistRouteRef } from '../../routes';
import { PlaylistEditDialog } from '../PlaylistEditDialog';

const useStyles = makeStyles({
  dialog: {
    height: '50%',
  },
  dialogTitle: {
    paddingBottom: '5px',
  },
  dialogContent: {
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  search: {
    fontSize: '16px',
  },
});

/**
 * @public
 */
export type EntityPlaylistDialogProps = {
  open: boolean;
  onClose: () => void;
};

export const EntityPlaylistDialog = (props: EntityPlaylistDialogProps) => {
  const { open, onClose } = props;

  const classes = useStyles();
  const navigate = useNavigate();
  const { entity } = useAsyncEntity();
  const alertApi = useApi(alertApiRef);
  const playlistApi = useApi(playlistApiRef);
  const playlistRoute = useRouteRef(playlistRouteRef);
  const [search, setSearch] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const { allowed: createAllowed } = usePermission({
    permission: permissions.playlistListCreate,
  });

  const closeDialog = useCallback(() => {
    setSearch('');
    onClose();
  }, [onClose, setSearch]);

  const [{ error, loading, value: playlists }, loadPlaylists] = useAsyncFn(
    () => playlistApi.getAllPlaylists({ editable: true }),
    [playlistApi],
  );

  useEffect(() => {
    if (open) {
      loadPlaylists();
    }
  }, [loadPlaylists, open]);

  const createNewPlaylist = useCallback(
    async (playlist: Omit<PlaylistMetadata, 'id'>) => {
      try {
        const playlistId = await playlistApi.createPlaylist(playlist);
        await playlistApi.addPlaylistEntities(playlistId, [
          stringifyEntityRef(entity!),
        ]);
        navigate(playlistRoute({ playlistId }));
      } catch (e) {
        alertApi.post({
          message: `Failed to add entity to playlist: ${e}`,
          severity: 'error',
        });
      }
    },
    [alertApi, entity, navigate, playlistApi, playlistRoute],
  );

  const [{ loading: addEntityLoading }, addToPlaylist] = useAsyncFn(
    async (playlist: Playlist) => {
      try {
        await playlistApi.addPlaylistEntities(playlist.id, [
          stringifyEntityRef(entity!),
        ]);
        closeDialog();
        alertApi.post({
          message: `Entity added to ${playlist.name}`,
          severity: 'success',
        });
      } catch (e) {
        alertApi.post({
          message: `Failed to add entity to playlist: ${e}`,
          severity: 'error',
        });
      }
    },
    [alertApi, closeDialog, entity, playlistApi],
  );

  return (
    <>
      <Dialog
        classes={{ paper: classes.dialog }}
        fullWidth
        maxWidth="xs"
        onClose={closeDialog}
        open={open}
      >
        {(loading || addEntityLoading) && <LinearProgress />}
        <DialogTitle className={classes.dialogTitle}>
          Add to Playlist
          <TextField
            fullWidth
            data-testid="entity-playlist-dialog-search"
            InputProps={{
              classes: {
                input: classes.search,
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearch('')}>
                    <ClearButton fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            margin="dense"
            onChange={e => setSearch(e.target.value)}
            placeholder="Search"
            size="small"
            value={search}
            variant="outlined"
          />
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {error && (
            <ResponseErrorPanel title="Error loading playlists" error={error} />
          )}
          {playlists && entity && (
            <List>
              {createAllowed && (
                <ListItem
                  button
                  disabled={addEntityLoading}
                  divider
                  onClick={() => setOpenEditDialog(true)}
                >
                  <ListItemIcon>
                    <PlaylistAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create new playlist" />
                </ListItem>
              )}
              {playlists
                .filter(
                  list =>
                    !search ||
                    list.name
                      .toLocaleLowerCase('en-US')
                      .includes(search.toLocaleLowerCase('en-US')),
                )
                .map(list => (
                  <React.Fragment key={list.id}>
                    <ListItem
                      button
                      disabled={addEntityLoading}
                      divider
                      onClick={() => addToPlaylist(list)}
                    >
                      <ListItemText
                        primary={list.name}
                        secondary={`by ${humanizeEntityRef(
                          parseEntityRef(list.owner),
                          { defaultKind: 'group' },
                        )} · ${list.entities} entities ${
                          !list.public ? '· Private' : ''
                        }`}
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={closeDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <PlaylistEditDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSave={createNewPlaylist}
      />
    </>
  );
};
