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

import { parseEntityRef } from '@backstage/catalog-model';
import { humanizeEntityRef } from '@backstage/plugin-catalog-react';
import { Playlist } from '@backstage/plugin-playlist-common';
import {
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useMemo, useState } from 'react';

import { usePlaylistList } from '../../hooks';
import { PlaylistFilter } from '../../types';

export class PlaylistOwnerFilter implements PlaylistFilter {
  constructor(readonly values: string[]) {}

  filterPlaylist(playlist: Playlist): boolean {
    return this.values.some(v => playlist.owner === v);
  }

  toQueryValue(): string[] {
    return this.values;
  }
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const PlaylistOwnerPicker = () => {
  const {
    updateFilters,
    backendPlaylists,
    filters,
    queryParameters: { owners: ownersParameter },
  } = usePlaylistList();

  const queryParamOwners = useMemo(
    () => [ownersParameter].flat().filter(Boolean) as string[],
    [ownersParameter],
  );

  const [selectedOwners, setSelectedOwners] = useState(
    queryParamOwners.length ? queryParamOwners : filters.owners?.values ?? [],
  );

  // Set selected owners on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamOwners.length) {
      setSelectedOwners(queryParamOwners);
    }
  }, [queryParamOwners]);

  useEffect(() => {
    updateFilters({
      owners: selectedOwners.length
        ? new PlaylistOwnerFilter(selectedOwners)
        : undefined,
    });
  }, [selectedOwners, updateFilters]);

  const availableOwners = useMemo(
    () => [...new Set(backendPlaylists.map(p => p.owner))].sort(),
    [backendPlaylists],
  );

  if (!availableOwners.length) return null;

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button" component="label">
        Owner
        <Autocomplete
          multiple
          options={availableOwners}
          value={selectedOwners}
          onChange={(_: object, value: string[]) => setSelectedOwners(value)}
          renderTags={(values: string[], getTagProps: Function) =>
            values.map((val, index) => (
              <Chip
                key={index}
                size="small"
                label={humanizeEntityRef(parseEntityRef(val), {
                  defaultKind: 'group',
                })}
                {...getTagProps({ index })}
              />
            ))
          }
          renderOption={(option, { selected }) => (
            <FormControlLabel
              control={
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  checked={selected}
                />
              }
              label={humanizeEntityRef(parseEntityRef(option), {
                defaultKind: 'group',
              })}
            />
          )}
          size="small"
          popupIcon={<ExpandMoreIcon data-testid="owner-picker-expand" />}
          renderInput={params => <TextField {...params} variant="outlined" />}
        />
      </Typography>
    </Box>
  );
};
