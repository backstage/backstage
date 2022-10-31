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
  Header,
  HeaderActionMenu,
  HeaderLabel,
} from '@backstage/core-components';
import { errorApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import { EntityRefLink } from '@backstage/plugin-catalog-react';
import { usePermission } from '@backstage/plugin-permission-react';
import {
  permissions,
  Playlist,
  PlaylistMetadata,
} from '@backstage/plugin-playlist-common';
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAsyncFn from 'react-use/lib/useAsyncFn';

import { playlistApiRef } from '../../api';
import { rootRouteRef } from '../../routes';
import { PlaylistEditDialog } from '../PlaylistEditDialog';

const useStyles = makeStyles({
  buttonWrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  chip: {
    marginTop: '5px',
    marginBottom: '5px',
  },
});

export type PlaylistHeaderProps = {
  playlist: Playlist;
  onUpdate: () => void;
};

export const PlaylistHeader = ({ playlist, onUpdate }: PlaylistHeaderProps) => {
  const classes = useStyles();
  const errorApi = useApi(errorApiRef);
  const playlistApi = useApi(playlistApiRef);
  const navigate = useNavigate();
  const rootRoute = useRouteRef(rootRouteRef);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { allowed: editAllowed } = usePermission({
    permission: permissions.playlistListUpdate,
    resourceRef: playlist.id,
  });

  const { allowed: deleteAllowed } = usePermission({
    permission: permissions.playlistListDelete,
    resourceRef: playlist.id,
  });

  const updatePlaylist = useCallback(
    async (update: Omit<PlaylistMetadata, 'id'>) => {
      try {
        await playlistApi.updatePlaylist({ ...update, id: playlist.id });
        setOpenEditDialog(false);
        onUpdate();
      } catch (e) {
        errorApi.post(e);
      }
    },
    [errorApi, onUpdate, playlist, playlistApi],
  );

  const [deleting, deletePlaylist] = useAsyncFn(async () => {
    try {
      await playlistApi.deletePlaylist(playlist.id);
      navigate(rootRoute());
    } catch (e) {
      errorApi.post(e);
    }
  }, [playlistApi]);

  return (
    <Header
      type={!playlist.public ? 'private' : undefined}
      title={playlist.name}
      subtitle={
        <>
          <Chip
            className={classes.chip}
            size="small"
            variant="outlined"
            label={`${playlist.followers} followers`}
          />
        </>
      }
    >
      <HeaderLabel
        label="Owner"
        value={
          <EntityRefLink
            entityRef={playlist.owner}
            defaultKind="group"
            color="inherit"
          />
        }
      />
      <HeaderActionMenu
        actionItems={[
          {
            label: 'Edit Details',
            icon: <EditIcon />,
            disabled: !editAllowed,
            onClick: () => setOpenEditDialog(true),
          },
          {
            label: 'Delete Playlist',
            icon: <DeleteIcon />,
            disabled: !deleteAllowed,
            onClick: () => setOpenDeleteDialog(true),
          },
        ]}
      />
      <PlaylistEditDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSave={updatePlaylist}
        playlist={{
          name: playlist.name,
          description: playlist.description,
          owner: playlist.owner,
          public: playlist.public,
        }}
      />
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogContent>
          Are you sure you want to delete <b>{playlist.name}</b> (
          {playlist.followers} followers) ?
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            disabled={deleting.loading}
            onClick={() => setOpenDeleteDialog(false)}
          >
            Cancel
          </Button>
          <div className={classes.buttonWrapper}>
            <Button
              color="secondary"
              data-testid="delete-playlist-dialog-button"
              disabled={deleting.loading}
              onClick={deletePlaylist}
            >
              Delete
            </Button>
            {deleting.loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </DialogActions>
      </Dialog>
    </Header>
  );
};
