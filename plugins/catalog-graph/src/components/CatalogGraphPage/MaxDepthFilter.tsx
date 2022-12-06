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
  FormControl,
  IconButton,
  InputAdornment,
  makeStyles,
  OutlinedInput,
  Typography,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export type Props = {
  value: number;
  onChange: (value: number) => void;
};

const useStyles = makeStyles(
  {
    formControl: {
      width: '100%',
      maxWidth: 300,
    },
  },
  { name: 'PluginCatalogGraphMaxDepthFilter' },
);

export const MaxDepthFilter = ({ value, onChange }: Props) => {
  const classes = useStyles();
  const onChangeRef = useRef(onChange);
  const [currentValue, setCurrentValue] = useState(value);

  // Keep a fresh reference to the latest callback
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // If the value changes externally, update ourselves
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // When the entered text changes, update ourselves and communicate externally
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValueNumeric = Number(event.target.value);
      const newValue =
        Number.isFinite(newValueNumeric) && newValueNumeric > 0
          ? newValueNumeric
          : Number.POSITIVE_INFINITY;
      setCurrentValue(newValue);
      onChangeRef.current(newValue);
    },
    [],
  );

  const reset = useCallback(() => {
    setCurrentValue(Number.POSITIVE_INFINITY);
    onChangeRef.current(Number.POSITIVE_INFINITY);
  }, [onChangeRef]);

  return (
    <Box pb={1} pt={1}>
      <FormControl variant="outlined" className={classes.formControl}>
        <Typography variant="button">Max Depth</Typography>
        <OutlinedInput
          type="number"
          placeholder="∞ Infinite"
          value={Number.isFinite(currentValue) ? String(currentValue) : ''}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="clear max depth"
                onClick={reset}
                edge="end"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          }
          inputProps={{
            'aria-label': 'maxp',
          }}
          labelWidth={0}
        />
      </FormControl>
    </Box>
  );
};
