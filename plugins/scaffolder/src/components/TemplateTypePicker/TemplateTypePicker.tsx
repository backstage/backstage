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

import React from 'react';
import capitalize from 'lodash/capitalize';
import { Progress } from '@backstage/core-components';
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
import { useEntityTypeFilter } from '@backstage/plugin-catalog-react';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const TemplateTypePicker = () => {
  const alertApi = useApi(alertApiRef);
  const { error, loading, availableTypes, selectedTypes, setSelectedTypes } =
    useEntityTypeFilter();

  if (loading) return <Progress />;

  if (!availableTypes) return null;

  if (error) {
    alertApi.post({
      message: `Failed to load entity types`,
      severity: 'error',
    });
    return null;
  }

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button">Categories</Typography>
      <Autocomplete<string>
        multiple
        aria-label="Categories"
        options={availableTypes}
        value={selectedTypes}
        onChange={(_: object, value: string[]) => setSelectedTypes(value)}
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
        popupIcon={<ExpandMoreIcon data-testid="categories-picker-expand" />}
        renderInput={params => <TextField {...params} variant="outlined" />}
      />
    </Box>
  );
};
