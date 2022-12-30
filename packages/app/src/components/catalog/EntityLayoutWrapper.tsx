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

import React, { ReactNode, useMemo, useState } from 'react';

import { EntityBadgesDialog } from '@backstage/plugin-badges';
import { EntityPlaylistDialog } from '@backstage/plugin-playlist';

import { EntityLayout } from '@internal/plugin-catalog-customized';

import BadgeIcon from '@material-ui/icons/CallToAction';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

export const EntityLayoutWrapper = (props: { children?: ReactNode }) => {
  const [badgesDialogOpen, setBadgesDialogOpen] = useState(false);
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);

  const extraMenuItems = useMemo(() => {
    return [
      {
        title: 'Badges',
        Icon: BadgeIcon,
        onClick: () => setBadgesDialogOpen(true),
      },
      {
        title: 'Add to playlist',
        Icon: PlaylistAddIcon,
        onClick: () => setPlaylistDialogOpen(true),
      },
    ];
  }, []);

  return (
    <>
      <EntityLayout
        UNSTABLE_extraContextMenuItems={extraMenuItems}
        UNSTABLE_contextMenuOptions={{
          disableUnregister: 'visible',
        }}
      >
        {props.children}
      </EntityLayout>
      <EntityBadgesDialog
        open={badgesDialogOpen}
        onClose={() => setBadgesDialogOpen(false)}
      />
      <EntityPlaylistDialog
        open={playlistDialogOpen}
        onClose={() => setPlaylistDialogOpen(false)}
      />
    </>
  );
};
