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
import {
  Content,
  ItemCardGrid,
  Progress,
  WarningPanel,
} from '@backstage/core-components';
import { Typography } from '@material-ui/core';

import { usePlaylistList } from '../../hooks';
import { PlaylistCard } from '../PlaylistCard';

export const PlaylistList = () => {
  const { loading, error, playlists } = usePlaylistList();

  return (
    <>
      {loading && <Progress />}

      {error && (
        <WarningPanel title="Oops! Something went wrong loading playlists">
          {error.message}
        </WarningPanel>
      )}

      {!error && !loading && !playlists.length && (
        <Typography variant="body2">
          No playlists found that match your filter.
        </Typography>
      )}

      <Content>
        <ItemCardGrid>
          {playlists?.length > 0 &&
            playlists.map(playlist => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
        </ItemCardGrid>
      </Content>
    </>
  );
};
