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

import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useMemo, useState } from 'react';
import { EntityKindFilter } from '../../filters';
import { useEntityList } from '../../hooks';
import { filterKinds, useAllKinds } from './kindFilterUtils';

function useEntityKindFilter(opts: { initialFilter: string[] }): {
  loading: boolean;
  error?: Error;
  allKinds: string[];
  selectedKinds: string[];
  setSelectedKinds: (kind: string[]) => void;
} {
  const {
    filters,
    queryParameters: { kind: kindParameter },
    updateFilters,
  } = useEntityList();

  const queryParamKind = useMemo(
    () => [kindParameter].flat().filter(Boolean) as string[],
    [kindParameter],
  );

  const [selectedKinds, setSelectedKinds] = useState(
    queryParamKind.length > 0
      ? queryParamKind
      : filters.kind?.value ?? opts.initialFilter,
  );

  // Set selected kinds on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamKind && queryParamKind.length > 0) {
      setSelectedKinds(queryParamKind);
    }
  }, [queryParamKind]);

  // Set selected kind from filters; this happens when the kind filter is
  // updated from another component
  useEffect(() => {
    if (filters.kind?.value) {
      setSelectedKinds(filters.kind?.value);
    }
  }, [filters.kind]);

  useEffect(() => {
    updateFilters({
      kind: selectedKinds ? new EntityKindFilter(selectedKinds) : undefined,
    });
  }, [selectedKinds, updateFilters]);

  const { allKinds, loading, error } = useAllKinds();

  return {
    loading,
    error,
    allKinds: allKinds ?? [],
    selectedKinds,
    setSelectedKinds,
  };
}

/**
 * Props for {@link EntityKindPicker}.
 *
 * @public
 */
export interface EntityKindPickerProps {
  /**
   * Entity kinds to show in the dropdown; by default all kinds are fetched from the catalog and
   * displayed.
   */
  allowedKinds?: string[];
  initialFilter?: string[];
  hidden?: boolean;
}

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
export const EntityKindPicker = (props: EntityKindPickerProps) => {
  const classes = useStyles();

  const { allowedKinds, hidden, initialFilter = ['component'] } = props;

  const [, setText] = useState('');

  const alertApi = useApi(alertApiRef);

  const { loading, error, allKinds, selectedKinds, setSelectedKinds } =
    useEntityKindFilter({
      initialFilter: initialFilter,
    });

  useEffect(() => {
    if (error) {
      alertApi.post({
        message: `Failed to load entity kinds`,
        severity: 'error',
      });
    }
  }, [error, alertApi]);

  if (error) return null;

  const options = filterKinds(allKinds, allowedKinds, selectedKinds);

  return hidden ? null : (
    <Box pb={1} pt={1}>
      <Typography variant="button" component="label">
        Kind
        <Autocomplete
          multiple
          disableCloseOnSelect
          loading={loading}
          options={Object.keys(options)}
          value={selectedKinds}
          onChange={(_: object, kinds) => {
            setText('');
            setSelectedKinds(kinds);
          }}
          renderOption={(kind, { selected }) => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    checked={selected}
                  />
                }
                onClick={event => event.preventDefault()}
                label={
                  <Box display="flex" flexWrap="wrap" alignItems="center">
                    {options[kind]}
                  </Box>
                }
              />
            );
          }}
          size="small"
          popupIcon={<ExpandMoreIcon data-testid="kind-picker-expand" />}
          renderInput={params => (
            <TextField
              {...params}
              className={classes.input}
              onChange={e => {
                setText(e.currentTarget.value);
              }}
              variant="outlined"
            />
          )}
        />
      </Typography>
    </Box>
  );
};
