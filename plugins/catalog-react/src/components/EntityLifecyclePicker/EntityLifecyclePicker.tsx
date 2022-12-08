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
import { EntityLifecycleFilter } from '../../filters';

/** @public */
export type CatalogReactEntityLifecyclePickerClassKey = 'input';

const useStyles = makeStyles(
  {
    input: {},
  },
  {
    name: 'CatalogReactEntityLifecyclePicker',
  },
);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/** @public */
export const EntityLifecyclePicker = () => {
  const classes = useStyles();
  const {
    updateFilters,
    backendEntities,
    filters,
    queryParameters: { lifecycles: lifecyclesParameter },
  } = useEntityList();

  const queryParamLifecycles = useMemo(
    () => [lifecyclesParameter].flat().filter(Boolean) as string[],
    [lifecyclesParameter],
  );

  const [selectedLifecycles, setSelectedLifecycles] = useState(
    queryParamLifecycles.length
      ? queryParamLifecycles
      : filters.lifecycles?.values ?? [],
  );

  // Set selected lifecycles on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamLifecycles.length) {
      setSelectedLifecycles(queryParamLifecycles);
    }
  }, [queryParamLifecycles]);

  const availableLifecycles = useMemo(
    () =>
      [
        ...new Set(
          backendEntities
            .map((e: Entity) => e.spec?.lifecycle)
            .filter(Boolean) as string[],
        ),
      ].sort(),
    [backendEntities],
  );

  useEffect(() => {
    updateFilters({
      lifecycles:
        selectedLifecycles.length && availableLifecycles.length
          ? new EntityLifecycleFilter(selectedLifecycles)
          : undefined,
    });
  }, [selectedLifecycles, updateFilters, availableLifecycles]);

  if (!availableLifecycles.length) return null;

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button" component="label">
        Lifecycle
        <Autocomplete
          multiple
          options={availableLifecycles}
          value={selectedLifecycles}
          onChange={(_: object, value: string[]) =>
            setSelectedLifecycles(value)
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
              label={option}
            />
          )}
          size="small"
          popupIcon={<ExpandMoreIcon data-testid="lifecycle-picker-expand" />}
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
