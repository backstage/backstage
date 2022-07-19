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
import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { RepoUrlPickerState } from './types';

export const GerritRepoPicker = (props: {
  onChange: (state: RepoUrlPickerState) => void;
  state: RepoUrlPickerState;
  rawErrors: string[];
}) => {
  const { onChange, rawErrors, state } = props;
  const { workspace, owner } = state;
  return (
    <>
      <FormControl margin="normal" error={rawErrors?.length > 0 && !workspace}>
        <InputLabel htmlFor="ownerInput">Owner</InputLabel>
        <Input
          id="ownerInput"
          onChange={e => onChange({ owner: e.target.value })}
          value={owner}
        />
        <FormHelperText>The owner of the project (optional)</FormHelperText>
      </FormControl>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !workspace}
      >
        <InputLabel htmlFor="parentInput">Parent</InputLabel>
        <Input
          id="parentInput"
          onChange={e => onChange({ workspace: e.target.value })}
          value={workspace}
        />
        <FormHelperText>
          The project parent that the repo will belong to
        </FormHelperText>
      </FormControl>
    </>
  );
};
