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
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import React, { useState } from 'react';
import { useEntityList } from '../../hooks';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { CatalogAutocomplete } from '../CatalogAutocomplete';

/** @public */
export type CatalogReactEntityProcessingStatusPickerClassKey = 'input';

const useStyles = makeStyles(
  {
    root: {},
    input: {},
    label: {},
  },
  { name: 'CatalogReactEntityProcessingStatusPickerPicker' },
);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/** @public */
export const EntityProcessingStatusPicker = () => {
  const classes = useStyles();
  const { updateFilters } = useEntityList();
  const { t } = useTranslationRef(catalogReactTranslationRef);

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
    <Box className={classes.root} pb={1} pt={1}>
      <CatalogAutocomplete<string, true>
        label={t('entityProcessingStatusPicker.title')}
        multiple
        disableCloseOnSelect
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
            onClick={event => event.preventDefault()}
            label={option}
          />
        )}
        name="processing-status-picker"
        LabelProps={{ className: classes.label }}
        TextFieldProps={{ className: classes.input }}
      />
    </Box>
  );
};
