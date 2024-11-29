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
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useCallback, useEffect, useMemo } from 'react';
import useAsync from 'react-use/esm/useAsync';

/** @public */
export type SelectedKindsFilterClassKey = 'formControl';

const useStyles = makeStyles(
  {
    formControl: {
      maxWidth: 300,
    },
  },
  { name: 'PluginCatalogGraphSelectedKindsFilter' },
);

export type Props = {
  value: string[] | undefined;
  onChange: (value: string[] | undefined) => void;
};

export const SelectedKindsFilter = ({ value, onChange }: Props) => {
  const classes = useStyles();
  const alertApi = useApi(alertApiRef);
  const catalogApi = useApi(catalogApiRef);

  const { error, value: kinds } = useAsync(async () => {
    return await catalogApi
      .getEntityFacets({ facets: ['kind'] })
      .then(response => response.facets.kind?.map(f => f.value).sort() || []);
  });

  useEffect(() => {
    if (error) {
      alertApi.post({
        message: `Failed to load entity kinds`,
        severity: 'error',
      });
    }
  }, [error, alertApi]);

  const normalizedKinds = useMemo(
    () => (kinds ? kinds.map(k => k.toLocaleLowerCase('en-US')) : kinds),
    [kinds],
  );

  const handleChange = useCallback(
    (_: unknown, v: string[]) => {
      onChange(
        normalizedKinds && normalizedKinds.every(r => v.includes(r))
          ? undefined
          : v,
      );
    },
    [normalizedKinds, onChange],
  );

  const handleEmpty = useCallback(() => {
    onChange(value?.length ? value : undefined);
  }, [value, onChange]);

  if (!kinds?.length || !normalizedKinds?.length || error) {
    return <></>;
  }

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button">Kinds</Typography>
      <Autocomplete
        className={classes.formControl}
        multiple
        limitTags={4}
        disableCloseOnSelect
        aria-label="Kinds"
        options={normalizedKinds}
        value={value ?? normalizedKinds}
        getOptionLabel={k => kinds[normalizedKinds.indexOf(k)] ?? k}
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
            label={kinds[normalizedKinds.indexOf(option)] ?? option}
          />
        )}
        size="small"
        popupIcon={<ExpandMoreIcon data-testid="selected-kinds-expand" />}
        renderInput={params => <TextField {...params} variant="outlined" />}
      />
    </Box>
  );
};
