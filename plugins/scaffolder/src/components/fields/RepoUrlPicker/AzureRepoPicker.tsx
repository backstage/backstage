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

export const AzureRepoPicker = (props: {
  state: RepoUrlPickerState;
  onChange: (state: RepoUrlPickerState) => void;
  rawErrors: string[];
}) => {
  const { rawErrors, state, onChange } = props;
  const { organization, repoName, owner } = state;
  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !organization}
      >
        <InputLabel htmlFor="orgInput">Organization</InputLabel>
        <Input
          id="orgInput"
          onChange={e => onChange({ organization: e.target.value })}
          value={organization}
        />
        <FormHelperText>
          The organization that this repo will belong to
        </FormHelperText>
      </FormControl>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !owner}
      >
        <InputLabel htmlFor="ownerInput">Owner</InputLabel>
        <Input
          id="ownerInput"
          onChange={e => onChange({ owner: e.target.value })}
          value={owner}
        />
        <FormHelperText>The Owner that this repo will belong to</FormHelperText>
      </FormControl>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !repoName}
      >
        <InputLabel htmlFor="repoNameInput">Repository</InputLabel>
        <Input
          id="repoNameInput"
          onChange={e => onChange({ repoName: e.target.value })}
          value={repoName}
        />
        <FormHelperText>The name of the repository</FormHelperText>
      </FormControl>
    </>
  );
};
