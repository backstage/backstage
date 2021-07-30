/*
 * Copyright 2021 Spotify AB
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
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';

type Props = {
  value: string[];
  options: string[];
  onChange: any;
  label: string;
};

export const InputMultiSelector = ({
  value,
  options,
  onChange,
  label,
}: Props) => {
  return (
    <Autocomplete
      style={{ marginTop: '0.5rem' }}
      multiple
      id="tags-filled"
      options={options}
      freeSolo
      onChange={onChange}
      value={value}
      renderTags={(tags: string[], getTagProps) => {
        return tags.map((option: string, index: number) => (
          <Chip
            variant="outlined"
            size="small"
            label={option}
            {...getTagProps({ index })}
          />
        ));
      }}
      renderInput={params => <TextField {...params} label={label} />}
    />
  );
};
