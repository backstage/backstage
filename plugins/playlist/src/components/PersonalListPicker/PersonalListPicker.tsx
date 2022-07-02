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
  configApiRef,
  IconComponent,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { Playlist } from '@backstage/plugin-playlist-common';
import {
  Card,
  List,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  MenuItem,
  Theme,
  Typography,
} from '@material-ui/core';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import SettingsIcon from '@material-ui/icons/Settings';
import { compact } from 'lodash';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';

import { usePlaylistList } from '../../hooks';
import { PlaylistFilter } from '../../types';

export const enum PersonalListFilterValue {
  owned = 'owned',
  following = 'following',
  all = 'all',
}

export class PersonalListFilter implements PlaylistFilter {
  constructor(
    readonly value: PersonalListFilterValue,
    readonly isOwnedPlaylist: (playlist: Playlist) => boolean,
  ) {}

  filterPlaylist(playlist: Playlist): boolean {
    switch (this.value) {
      case PersonalListFilterValue.owned:
        return this.isOwnedPlaylist(playlist);
      case PersonalListFilterValue.following:
        return playlist.isFollowing;
      default:
        return true;
    }
  }

  toQueryValue(): string {
    return this.value;
  }
}

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .11)',
    boxShadow: 'none',
    margin: theme.spacing(1, 0, 1, 0),
  },
  title: {
    margin: theme.spacing(1, 0, 0, 1),
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listIcon: {
    minWidth: 30,
    color: theme.palette.text.primary,
  },
  menuItem: {
    minHeight: theme.spacing(6),
  },
  groupWrapper: {
    margin: theme.spacing(1, 1, 2, 1),
  },
}));

type ButtonGroup = {
  name: string;
  items: {
    id: PersonalListFilterValue;
    label: string;
    icon?: IconComponent;
  }[];
};

function getFilterGroups(orgName: string | undefined): ButtonGroup[] {
  return [
    {
      name: 'Personal',
      items: [
        {
          id: PersonalListFilterValue.owned,
          label: 'Owned',
          icon: SettingsIcon,
        },
        {
          id: PersonalListFilterValue.following,
          label: 'Following',
          icon: PlaylistPlayIcon,
        },
      ],
    },
    {
      name: orgName ?? 'Company',
      items: [
        {
          id: PersonalListFilterValue.all,
          label: 'All',
        },
      ],
    },
  ];
}

export const PersonalListPicker = () => {
  const classes = useStyles();
  const configApi = useApi(configApiRef);
  const identityApi = useApi(identityApiRef);
  const orgName = configApi.getOptionalString('organization.name') ?? 'Company';
  const filterGroups = getFilterGroups(orgName);

  const { loading: loadingOwnership, value: ownershipRefs } =
    useAsync(async () => {
      const { ownershipEntityRefs } = await identityApi.getBackstageIdentity();
      return ownershipEntityRefs;
    }, []);

  const isOwnedPlaylist = useMemo(() => {
    const myOwnerRefs = new Set(ownershipRefs ?? []);
    return (playlist: Playlist) => myOwnerRefs.has(playlist.owner);
  }, [ownershipRefs]);

  const {
    filters,
    updateFilters,
    backendPlaylists,
    queryParameters: { personal: personalParameter },
    loading: loadingBackendPlaylists,
  } = usePlaylistList();

  const loading = loadingBackendPlaylists || loadingOwnership;

  // Static filters; used for generating counts of potentially unselected options
  const ownedFilter = useMemo(
    () =>
      new PersonalListFilter(PersonalListFilterValue.owned, isOwnedPlaylist),
    [isOwnedPlaylist],
  );
  const followingFilter = useMemo(
    () =>
      new PersonalListFilter(
        PersonalListFilterValue.following,
        isOwnedPlaylist,
      ),
    [isOwnedPlaylist],
  );

  const queryParamPersonalFilter = useMemo(
    () => [personalParameter].flat()[0],
    [personalParameter],
  );

  const [selectedPersonalFilter, setSelectedPersonalFilter] = useState(
    queryParamPersonalFilter ?? PersonalListFilterValue.all,
  );

  // To show proper counts for each section, apply all other frontend filters _except_ the personal
  // filter that's controlled by this picker.
  const playlistsWithoutPersonalFilter = useMemo(
    () =>
      backendPlaylists.filter(playlist =>
        compact(Object.values({ ...filters, personal: undefined })).every(
          (filter: PlaylistFilter) =>
            !filter.filterPlaylist || filter.filterPlaylist(playlist),
        ),
      ),
    [filters, backendPlaylists],
  );

  const filterCounts = useMemo<Record<string, number>>(
    () => ({
      all: playlistsWithoutPersonalFilter.length,
      following: playlistsWithoutPersonalFilter.filter(playlist =>
        followingFilter.filterPlaylist(playlist),
      ).length,
      owned: playlistsWithoutPersonalFilter.filter(playlist =>
        ownedFilter.filterPlaylist(playlist),
      ).length,
    }),
    [playlistsWithoutPersonalFilter, followingFilter, ownedFilter],
  );

  // Set selected personal filter on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamPersonalFilter) {
      setSelectedPersonalFilter(queryParamPersonalFilter);
    }
  }, [queryParamPersonalFilter]);

  useEffect(() => {
    if (
      !loading &&
      !!selectedPersonalFilter &&
      selectedPersonalFilter !== PersonalListFilterValue.all &&
      filterCounts[selectedPersonalFilter] === 0
    ) {
      setSelectedPersonalFilter(PersonalListFilterValue.all);
    }
  }, [
    loading,
    filterCounts,
    selectedPersonalFilter,
    setSelectedPersonalFilter,
  ]);

  useEffect(() => {
    updateFilters({
      personal: selectedPersonalFilter
        ? new PersonalListFilter(
            selectedPersonalFilter as PersonalListFilterValue,
            isOwnedPlaylist,
          )
        : undefined,
    });
  }, [selectedPersonalFilter, isOwnedPlaylist, updateFilters]);

  return (
    <Card className={classes.root}>
      {filterGroups.map(group => (
        <Fragment key={group.name}>
          <Typography
            variant="subtitle2"
            component="span"
            className={classes.title}
          >
            {group.name}
          </Typography>
          <Card className={classes.groupWrapper}>
            <List disablePadding dense role="menu" aria-label={group.name}>
              {group.items.map(item => (
                <MenuItem
                  role="none presentation"
                  key={item.id}
                  button
                  divider
                  onClick={() => setSelectedPersonalFilter(item.id)}
                  selected={item.id === selectedPersonalFilter}
                  className={classes.menuItem}
                  disabled={filterCounts[item.id] === 0}
                  data-testid={`personal-picker-${item.id}`}
                  tabIndex={0}
                  ContainerProps={{ role: 'menuitem' }}
                >
                  {item.icon && (
                    <ListItemIcon className={classes.listIcon}>
                      <item.icon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <ListItemText>
                    <Typography variant="body1">{item.label} </Typography>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    {filterCounts[item.id] || '-'}
                  </ListItemSecondaryAction>
                </MenuItem>
              ))}
            </List>
          </Card>
        </Fragment>
      ))}
    </Card>
  );
};
