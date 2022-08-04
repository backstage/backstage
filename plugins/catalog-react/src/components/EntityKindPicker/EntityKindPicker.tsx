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

import { useApi } from '@backstage/core-plugin-api';
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
import useAsync from 'react-use/lib/useAsync';
import { catalogApiRef } from '../../api';
import { EntityKindFilter } from '../../filters';
import { useEntityList } from '../../hooks';

const useStyles = makeStyles(
  {
    input: {},
  },
  {
    name: 'CatalogReactEntityKindPicker',
  },
);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/** @public */
export const EntityKindPicker = () => {
  const classes = useStyles();
  const {
    updateFilters,
    filters,
    queryParameters: { kind: kindsParameter },
  } = useEntityList();

  const catalogApi = useApi(catalogApiRef);
  const { value: availableKinds } = useAsync(async () => {
    const facet = 'kind';
    const { facets } = await catalogApi.getEntityFacets({
      facets: [facet],
    });

    return facets[facet].map(({ value }) => value);
  }, [filters.kind]);

  const queryParamKinds = useMemo(
    () => [kindsParameter].flat().filter(Boolean) as string[],
    [kindsParameter],
  );

  const [selectedKinds, setSelectedKinds] = useState(
    queryParamKinds.length ? queryParamKinds : filters.kind?.getKinds() ?? [],
  );

  // Set selected kinds on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamKinds.length) {
      setSelectedKinds(queryParamKinds);
    }
  }, [queryParamKinds]);

  useEffect(() => {
    updateFilters({
      kind: selectedKinds.length
        ? new EntityKindFilter(selectedKinds)
        : undefined,
    });
  }, [selectedKinds, updateFilters]);

  if (!availableKinds?.length) return null;

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button" component="label">
        Kinds
        <Autocomplete
          multiple
          options={availableKinds}
          value={selectedKinds}
          onChange={(_: object, value: string[]) => setSelectedKinds(value)}
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
          popupIcon={<ExpandMoreIcon data-testid="kind-picker-expand" />}
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
