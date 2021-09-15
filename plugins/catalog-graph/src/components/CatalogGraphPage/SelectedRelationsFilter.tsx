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
import React, { useCallback, useMemo } from 'react';
import { RelationPairs } from '../EntityRelationsGraph';

const useStyles = makeStyles({
  formControl: {
    maxWidth: 300,
  },
});

export type Props = {
  relationPairs: RelationPairs;
  value: string[] | undefined;
  onChange: (value: string[] | undefined) => void;
};

export const SelectedRelationsFilter = ({
  relationPairs,
  value,
  onChange,
}: Props) => {
  const classes = useStyles();
  const relations = useMemo(
    () => relationPairs.flatMap(r => r),
    [relationPairs],
  );

  const handleChange = useCallback(
    (_: unknown, v: string[]) => {
      onChange(relations.every(r => v.includes(r)) ? undefined : v);
    },
    [relations, onChange],
  );

  const handleEmpty = useCallback(() => {
    onChange(value?.length ? value : undefined);
  }, [value, onChange]);

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button">Relations</Typography>
      <Autocomplete<string>
        className={classes.formControl}
        multiple
        limitTags={4}
        disableCloseOnSelect
        aria-label="Relations"
        options={relations}
        value={value ?? relations}
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
            label={option}
          />
        )}
        size="small"
        popupIcon={<ExpandMoreIcon data-testid="selected-relations-expand" />}
        renderInput={params => <TextField {...params} variant="outlined" />}
      />
    </Box>
  );
};
