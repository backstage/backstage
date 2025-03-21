/*
 * Copyright 2024 The Backstage Authors
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

import FormControl from '@material-ui/core/FormControl';
import React from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';

import { BaseRepoBranchPickerProps } from './types';

/**
 * The underlying component that is rendered in the form for the `DefaultRepoBranchPicker`
 * field extension.
 *
 * @public
 *
 */
export const DefaultRepoBranchPicker = ({
  onChange,
  state,
  rawErrors,
  isDisabled,
  required,
}: BaseRepoBranchPickerProps) => {
  const { branch } = state;

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !branch}
    >
      <TextField
        id="branchInput"
        label="Branch"
        disabled={isDisabled}
        onChange={e => onChange({ branch: e.target.value })}
        value={branch}
      />
      <FormHelperText>The branch of the repository</FormHelperText>
    </FormControl>
  );
};
