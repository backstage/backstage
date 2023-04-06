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

import { Playlist } from '@backstage/plugin-playlist-common';
import {
  ListSubheader,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import React from 'react';
import useEffectOnce from 'react-use/lib/useEffectOnce';

import { usePlaylistList } from '../../hooks';
import { PlaylistSortCompareFunction } from '../../types';

export const enum DefaultPlaylistSortTypes {
  popular = 'popular',
  alphabetical = 'alphabetical',
  numEntities = 'numEntities',
}

export const DefaultSortCompareFunctions: {
  [type in DefaultPlaylistSortTypes]: PlaylistSortCompareFunction;
} = {
  [DefaultPlaylistSortTypes.popular]: (a: Playlist, b: Playlist) => {
    if (a.followers < b.followers) {
      return 1;
    } else if (a.followers > b.followers) {
      return -1;
    }
    return 0;
  },
  [DefaultPlaylistSortTypes.alphabetical]: (a: Playlist, b: Playlist) =>
    a.name.localeCompare(b.name),
  [DefaultPlaylistSortTypes.numEntities]: (a: Playlist, b: Playlist) => {
    if (a.entities < b.entities) {
      return 1;
    } else if (a.entities > b.entities) {
      return -1;
    }
    return 0;
  },
};

const sortTypeLabels = {
  [DefaultPlaylistSortTypes.popular]: 'Popular',
  [DefaultPlaylistSortTypes.alphabetical]: 'Alphabetical',
  [DefaultPlaylistSortTypes.numEntities]: '# Entities',
};

const useStyles = makeStyles({
  select: {
    width: '10rem',
    marginRight: '1rem',
  },
  icon: {
    verticalAlign: 'bottom',
  },
});

export const PlaylistSortPicker = () => {
  const classes = useStyles();
  const { updateSort } = usePlaylistList();

  useEffectOnce(() =>
    updateSort(DefaultSortCompareFunctions[DefaultPlaylistSortTypes.popular]),
  );

  return (
    <Select
      className={classes.select}
      disableUnderline
      data-testid="sort-picker-select"
      renderValue={val => (
        <Typography>
          <SwapVertIcon className={classes.icon} />
          {sortTypeLabels[val as DefaultPlaylistSortTypes]}
        </Typography>
      )}
      defaultValue={DefaultPlaylistSortTypes.popular}
      onChange={e =>
        updateSort(
          DefaultSortCompareFunctions[
            e.target.value as DefaultPlaylistSortTypes
          ],
        )
      }
    >
      <ListSubheader onClickCapture={e => e.stopPropagation()}>
        Sort By
      </ListSubheader>
      {Object.entries(sortTypeLabels).map(([val, label]) => (
        <MenuItem key={val} value={val}>
          {label}
        </MenuItem>
      ))}
    </Select>
  );
};
