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

import { Progress } from '@backstage/core-components';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { useEntityTypeFilter } from '@backstage/plugin-catalog-react';
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
import capitalize from 'lodash/capitalize';
import React, { ReactNode } from 'react';

import { scaffolderReactTranslationRef } from '../../../translation';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/** @alpha */
export type ScaffolderReactTemplateCategoryPickerClassKey = 'root' | 'label';

const useStyles = makeStyles(
  {
    root: {},
    label: {},
  },
  { name: 'ScaffolderReactTemplateCategoryPicker' },
);

/**
 * The Category Picker that is rendered on the left side for picking
 * categories and filtering the template list.
 * @alpha
 */
export const TemplateCategoryPicker = () => {
  const { t } = useTranslationRef(scaffolderReactTranslationRef);
  const classes = useStyles();
  const alertApi = useApi(alertApiRef);
  const { error, loading, availableTypes, selectedTypes, setSelectedTypes } =
    useEntityTypeFilter();

  if (loading) return <Progress />;

  if (error) {
    alertApi.post({
      message: `Failed to load entity types with error: ${error}`,
      severity: 'error',
    });
    return null;
  }

  if (!availableTypes) return null;

  return (
    <Box className={classes.root} pb={1} pt={1}>
      <Typography
        className={classes.label}
        variant="button"
        component="label"
        htmlFor="categories-picker"
      >
        {t('templateCategoryPicker.title')}
      </Typography>
      <Autocomplete<string, true>
        PopperComponent={popperProps => (
          <div {...popperProps}>{popperProps.children as ReactNode}</div>
        )}
        multiple
        id="categories-picker"
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
            label={capitalize(option)}
          />
        )}
        size="small"
        popupIcon={<ExpandMoreIcon />}
        renderInput={params => <TextField {...params} variant="outlined" />}
      />
    </Box>
  );
};
