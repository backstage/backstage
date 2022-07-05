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

import { EntityErrorFilter, EntityOrphanFilter } from '../../filters';
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
import React, { useState } from 'react';
import { useEntityList } from '../../hooks';
import { Autocomplete } from '@material-ui/lab';

/** @public */
export type CatalogReactEntityProcessingStatusPickerClassKey = 'input';

const useStyles = makeStyles(
  {
    input: {},
  },
  {
    name: 'CatalogReactEntityProcessingStatusPickerPicker',
  },
);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/** @public */
export const EntityProcessingStatusPicker = () => {
  const classes = useStyles();
  const { updateFilters } = useEntityList();

  const [selectedAdvancedItems, setSelectedAdvancedItems] = useState<string[]>(
    [],
  );

  function orphanChange(value: boolean) {
    updateFilters({
      orphan: value ? new EntityOrphanFilter(value) : undefined,
    });
  }

  function errorChange(value: boolean) {
    updateFilters({
      error: value ? new EntityErrorFilter(value) : undefined,
    });
  }

  const availableAdvancedItems = ['Is Orphan', 'Has Error'];

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button" component="label">
        Processing Status
        <Autocomplete
          multiple
          options={availableAdvancedItems}
          value={selectedAdvancedItems}
          onChange={(_: object, value: string[]) => {
            setSelectedAdvancedItems(value);
            orphanChange(value.includes('Is Orphan'));
            errorChange(value.includes('Has Error'));
          }}
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
          popupIcon={
            <ExpandMoreIcon data-testid="processing-status-picker-expand" />
          }
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
