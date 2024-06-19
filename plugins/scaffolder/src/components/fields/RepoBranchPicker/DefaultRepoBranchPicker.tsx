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
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import { RepoBranchPickerState } from './types';

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
  required,
}: {
  onChange: (state: RepoBranchPickerState) => void;
  state: RepoBranchPickerState;
  rawErrors: string[];
  required?: boolean;
}) => {
  const { branch } = state;

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !branch}
    >
      <InputLabel htmlFor="branchInput">Branch</InputLabel>
      <Input
        id="branchInput"
        onChange={e => onChange({ branch: e.target.value })}
        value={branch}
      />
      <FormHelperText>The branch of the repository</FormHelperText>
    </FormControl>
  );
};
