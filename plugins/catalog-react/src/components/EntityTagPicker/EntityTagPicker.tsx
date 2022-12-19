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

import {
  Box,
  Checkbox,
  FormControlLabel,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useMemo, useState } from 'react';
import { useEntityList } from '../../hooks/useEntityListProvider';
import { EntityTagFilter } from '../../filters';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { catalogApiRef } from '../../api';

/** @public */
export type CatalogReactEntityTagPickerClassKey = 'input';

const useStyles = makeStyles(
  {
    input: {},
  },
  {
    name: 'CatalogReactEntityTagPicker',
  },
);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/** @public */
export type EntityTagPickerProps = {
  showCounts?: boolean;
};

/** @public */
export const EntityTagPicker = (props: EntityTagPickerProps) => {
  const classes = useStyles();
  const {
    updateFilters,
    filters,
    queryParameters: { tags: tagsParameter },
  } = useEntityList();

  const catalogApi = useApi(catalogApiRef);
  const { value: availableTags } = useAsync(async () => {
    const facet = 'metadata.tags';
    const { facets } = await catalogApi.getEntityFacets({
      facets: [facet],
      filter: filters.kind?.getCatalogFilters(),
    });

    return Object.fromEntries(
      facets[facet].map(({ value, count }) => [value, count]),
    );
  }, [filters.kind]);

  const queryParamTags = useMemo(
    () => [tagsParameter].flat().filter(Boolean) as string[],
    [tagsParameter],
  );

  const [selectedTags, setSelectedTags] = useState(
    queryParamTags.length ? queryParamTags : filters.tags?.values ?? [],
  );

  // Set selected tags on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamTags.length) {
      setSelectedTags(queryParamTags);
    }
  }, [queryParamTags]);

  useEffect(() => {
    const tags = Object.keys(availableTags ?? {});
    updateFilters({
      tags:
        selectedTags.length && tags.length
          ? new EntityTagFilter(selectedTags)
          : undefined,
    });
  }, [selectedTags, updateFilters, availableTags]);

  if (!Object.keys(availableTags ?? {}).length) return null;

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button" component="label">
        Tags
        <Autocomplete
          multiple
          options={Object.keys(availableTags ?? {})}
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
              label={
                props.showCounts
                  ? `${option} (${availableTags?.[option]})`
                  : option
              }
            />
          )}
          size="small"
          popupIcon={<ExpandMoreIcon data-testid="tag-picker-expand" />}
          renderInput={params => (
            <TextField
              {...params}
              className={classes.input}
              variant="outlined"
            />
          )}
        />
      </Typography>
    </Box>
  );
};
