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

import { Content, ErrorPage, Page } from '@backstage/core-components';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { usePermission } from '@backstage/plugin-permission-react';
import { permissions } from '@backstage/plugin-playlist-common';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAsyncFn from 'react-use/esm/useAsyncFn';

import { playlistApiRef } from '../../api';
import { PlaylistEntitiesTable } from './PlaylistEntitiesTable';
import { PlaylistHeader } from './PlaylistHeader';

const useStyles = makeStyles({
  followButton: {
    top: '6px',
    right: '8px',
  },
});

export const PlaylistPage = () => {
  const classes = useStyles();
  const errorApi = useApi(errorApiRef);
  const playlistApi = useApi(playlistApiRef);
  const { playlistId } = useParams();

  const [{ value: playlist, loading, error }, loadPlaylist] = useAsyncFn(
    () => playlistApi.getPlaylist(playlistId!),
    [playlistApi],
  );

  useEffect(() => {
    loadPlaylist();
  }, [loadPlaylist]);

  const { allowed: followAllowed } = usePermission({
    permission: permissions.playlistFollowersUpdate,
    resourceRef: playlist?.id,
  });

  const [{ loading: loadingFollowRequest }, followPlaylist] =
    useAsyncFn(async () => {
      try {
        if (playlist!.isFollowing) {
          await playlistApi.unfollowPlaylist(playlist!.id);
        } else {
          await playlistApi.followPlaylist(playlist!.id);
        }

        loadPlaylist();
      } catch (e) {
        errorApi.post(e);
      }
    }, [errorApi, loadPlaylist, playlist, playlistApi]);

  if (error) {
    return (
      <ErrorPage
        status={(error as ResponseError).response?.status.toString()}
        statusMessage={error.toString()}
        stack={error.stack}
      />
    );
  }

  return (
    <>
      {loading && <LinearProgress />}
      <Page themeId="home">
        {playlist && (
          <>
            <PlaylistHeader playlist={playlist} onUpdate={loadPlaylist} />
            <Content>
              <Card>
                <CardHeader
                  title="About"
                  action={
                    followAllowed && (
                      <Button
                        color="primary"
                        size="small"
                        variant="outlined"
                        data-testid="playlist-page-follow-button"
                        className={classes.followButton}
                        disabled={loadingFollowRequest}
                        onClick={followPlaylist}
                      >
                        {playlist.isFollowing ? 'Following' : 'Follow'}
                      </Button>
                    )
                  }
                />
                <Divider />
                <CardContent>
                  <Typography variant="body2">
                    {playlist.description}
                  </Typography>
                </CardContent>
              </Card>
              <br />
              <PlaylistEntitiesTable playlistId={playlist.id} />
            </Content>
          </>
        )}
      </Page>
    </>
  );
};
