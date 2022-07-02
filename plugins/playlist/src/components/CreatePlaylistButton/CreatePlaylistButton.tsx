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

import { errorApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import { BackstageTheme } from '@backstage/theme';
import { usePermission } from '@backstage/plugin-permission-react';
import {
  permissions,
  PlaylistMetadata,
} from '@backstage/plugin-playlist-common';
import { Button, IconButton, useMediaQuery } from '@material-ui/core';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { playlistApiRef } from '../../api';
import { playlistRouteRef } from '../../routes';
import { PlaylistEditDialog } from '../PlaylistEditDialog';

export const CreatePlaylistButton = () => {
  const navigate = useNavigate();
  const errorApi = useApi(errorApiRef);
  const playlistApi = useApi(playlistApiRef);
  const playlistRoute = useRouteRef(playlistRouteRef);
  const [openDialog, setOpenDialog] = useState(false);
  const { allowed } = usePermission({
    permission: permissions.playlistListCreate,
  });
  const isXSScreen = useMediaQuery<BackstageTheme>(theme =>
    theme.breakpoints.down('xs'),
  );

  const savePlaylist = useCallback(
    async (playlist: Omit<PlaylistMetadata, 'id'>) => {
      try {
        const playlistId = await playlistApi.createPlaylist(playlist);
        navigate(playlistRoute({ playlistId }));
      } catch (e) {
        errorApi.post(e);
      }
    },
    [errorApi, navigate, playlistApi, playlistRoute],
  );

  return (
    <>
      {isXSScreen ? (
        <IconButton
          disabled={!allowed}
          color="primary"
          title="Create Playlist"
          size="small"
          onClick={() => setOpenDialog(true)}
        >
          <AddCircleOutline />
        </IconButton>
      ) : (
        <Button
          disabled={!allowed}
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Create Playlist
        </Button>
      )}
      <PlaylistEditDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={savePlaylist}
      />
    </>
  );
};
