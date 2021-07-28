/*
 * Copyright 2021 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useMemo, useState } from 'react';
import { useEntityListProvider } from '../../hooks/useEntityListProvider';
import { EntityTagFilter } from '../../filters';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const EntityTagPicker = () => {
  const {
    updateFilters,
    backendEntities,
    filters,
    queryParameters,
  } = useEntityListProvider();

  const queryParamTags = [queryParameters.tags]
    .flat()
    .filter(Boolean) as string[];
  const [selectedTags, setSelectedTags] = useState(
    queryParamTags.length ? queryParamTags : filters.tags?.values ?? [],
  );

  useEffect(() => {
    updateFilters({
      tags: selectedTags.length ? new EntityTagFilter(selectedTags) : undefined,
    });
  }, [selectedTags, updateFilters]);

  const availableTags = useMemo(
    () =>
      [
        ...new Set(
          backendEntities
            .flatMap((e: Entity) => e.metadata.tags)
            .filter(Boolean) as string[],
        ),
      ].sort(),
    [backendEntities],
  );

  if (!availableTags.length) return null;

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button">Tags</Typography>
      <Autocomplete<string>
        multiple
        aria-label="Tags"
        options={availableTags}
        value={selectedTags}
        onChange={(_: object, value: string[]) => setSelectedTags(value)}
        renderOption={(option, { selected }) => (
          <FormControlLabel
            control={
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                checked={selected}
              />
            }
            label={option}
          />
        )}
        size="small"
        popupIcon={<ExpandMoreIcon data-testid="tag-picker-expand" />}
        renderInput={params => <TextField {...params} variant="outlined" />}
      />
    </Box>
  );
};
