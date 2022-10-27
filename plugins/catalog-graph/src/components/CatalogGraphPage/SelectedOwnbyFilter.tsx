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
import { catalogApiRef } from '@backstage/plugin-catalog-react';
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
import React, { useCallback, useEffect, useMemo } from 'react';
import useAsync from 'react-use/lib/useAsync';

const useStyles = makeStyles({
  formControl: {
    maxWidth: 300,
  },
});

export type Props = {
  value: string[] | undefined;
  onChange: (value: string[] | undefined) => void;
};

export const SelectedOwnbyFilter = ({ value, onChange }: Props) => {
  const classes = useStyles();
  const alertApi = useApi(alertApiRef);
  const catalogApi = useApi(catalogApiRef);

  const { error, value: ownedby } = useAsync(async () => {
    return await catalogApi.getEntityFacets({ facets: ['Group', 'User'] }).then(
      response =>
        response.facets['Group']
          .concat(response.facets['User'])
          ?.map(f => f.value)
          .sort() || [],
    );
  });

  useEffect(() => {
    if (error) {
      alertApi.post({
        message: `Failed to load entity kinds`,
        severity: 'error',
      });
    }
  }, [error, alertApi]);

  const normalizedOwnedby = useMemo(
    () =>
      ownedby
        ? ownedby.map(owner => owner.toLocaleLowerCase('en-US'))
        : ownedby,
    [ownedby],
  );

  const handleChange = useCallback(
    (_: unknown, v: string[]) => {
      onChange(
        normalizedOwnedby && normalizedOwnedby.every(r => v.includes(r))
          ? undefined
          : v,
      );
    },
    [normalizedOwnedby, onChange],
  );

  const handleEmpty = useCallback(() => {
    onChange(value?.length ? value : undefined);
  }, [value, onChange]);

  if (!ownedby?.length || !normalizedOwnedby?.length || error) {
    return null;
  }

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button">Ownedby</Typography>
      <Autocomplete
        className={classes.formControl}
        multiple
        limitTags={4}
        disableCloseOnSelect
        aria-label="Ownedby"
        options={normalizedOwnedby}
        value={value ?? normalizedOwnedby}
        getOptionLabel={owner =>
          ownedby[normalizedOwnedby.indexOf(owner)] ?? owner
        }
        onChange={handleChange}
        onBlur={handleEmpty}
        renderOption={(option, { selected }) => (
          <FormControlLabel
            control={
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                checked={selected}
              />
            }
            label={ownedby[normalizedOwnedby.indexOf(option)] ?? option}
          />
        )}
        size="small"
        popupIcon={<ExpandMoreIcon data-testid="selected-ownedby-expand" />}
        renderInput={params => <TextField {...params} variant="outlined" />}
      />
    </Box>
  );
};
