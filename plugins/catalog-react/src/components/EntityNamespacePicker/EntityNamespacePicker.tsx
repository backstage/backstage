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
import { EntityNamespaceFilter } from '../../filters';

/** @public */
export type CatalogReactEntityNamespacePickerClassKey = 'input';

const useStyles = makeStyles(
  {
    input: {},
  },
  {
    name: 'CatalogReactEntityNamespacePicker',
  },
);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/** @public */
export const EntityNamespacePicker = (props: { initialFilter?: string[] }) => {
  const { initialFilter = [] } = props;
  const classes = useStyles();
  const {
    updateFilters,
    backendEntities,
    filters,
    queryParameters: { namespace: namespaceParameter },
  } = useEntityList();

  const queryParamNamespace = useMemo(
    () => [namespaceParameter].flat().filter(Boolean) as string[],
    [namespaceParameter],
  );

  const [selectedNamespace, setSelectedNamespace] = useState(
    queryParamNamespace.length
      ? queryParamNamespace
      : filters.namespace?.values ?? initialFilter,
  );

  // Set selected namespace on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamNamespace.length) {
      setSelectedNamespace(queryParamNamespace);
    }
  }, [queryParamNamespace]);

  const availableNamespace = useMemo(
    () =>
      [
        ...new Set(
          backendEntities
            .map((e: Entity) => e.metadata.namespace)
            .filter(Boolean) as string[],
        ),
      ].sort(),
    [backendEntities],
  );

  useEffect(() => {
    updateFilters({
      namespace:
        selectedNamespace.length && availableNamespace.length
          ? new EntityNamespaceFilter(selectedNamespace)
          : undefined,
    });
  }, [selectedNamespace, updateFilters, availableNamespace]);

  if (!availableNamespace.length) return null;

  if (availableNamespace.every(namespace => namespace === 'default'))
    return null;

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button" component="label">
        Namespace
        <Autocomplete
          multiple
          options={availableNamespace}
          value={selectedNamespace}
          onChange={(_: object, value: string[]) => setSelectedNamespace(value)}
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
          popupIcon={<ExpandMoreIcon data-testid="namespace-picker-expand" />}
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
