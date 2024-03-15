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
  errorApiRef,
  useApi,
  useRouteRef,
  alertApiRef,
} from '@backstage/core-plugin-api';
import { usePermission } from '@backstage/plugin-permission-react';
import {
  permissions,
  PlaylistMetadata,
} from '@backstage/plugin-playlist-common';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Theme } from '@material-ui/core/styles';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { playlistApiRef } from '../../api';
import { playlistRouteRef } from '../../routes';
import { PlaylistEditDialog } from '../PlaylistEditDialog';
import { useTitle } from '../../hooks';

/**
 * @public
 */
export const CreatePlaylistButton = () => {
  const navigate = useNavigate();
  const errorApi = useApi(errorApiRef);
  const alertApi = useApi(alertApiRef);
  const playlistApi = useApi(playlistApiRef);
  const playlistRoute = useRouteRef(playlistRouteRef);
  const [openDialog, setOpenDialog] = useState(false);
  const { allowed } = usePermission({
    permission: permissions.playlistListCreate,
  });
  const isXSScreen = useMediaQuery<Theme>(theme =>
    theme.breakpoints.down('xs'),
  );

  const savePlaylist = useCallback(
    async (playlist: Omit<PlaylistMetadata, 'id'>) => {
      try {
        const playlistId = await playlistApi.createPlaylist(playlist);
        navigate(playlistRoute({ playlistId }));
        alertApi.post({
          message: `Added playlist '${playlist.name}'`,
          severity: 'success',
          display: 'transient',
        });
      } catch (e) {
        errorApi.post(e);
      }
    },
    [errorApi, navigate, playlistApi, playlistRoute, alertApi],
  );

  const singularTitle = useTitle({
    pluralize: false,
    lowerCase: false,
  });

  return (
    <>
      {isXSScreen ? (
        <IconButton
          disabled={!allowed}
          color="primary"
          title={`Create ${singularTitle}`}
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
          Create {singularTitle}
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
