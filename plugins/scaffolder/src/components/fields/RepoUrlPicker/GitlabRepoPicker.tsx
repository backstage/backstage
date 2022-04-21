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
import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { Select, SelectItem } from '@backstage/core-components';
import { RepoUrlPickerState } from './types';

export const GitlabRepoPicker = (props: {
  allowedOwners?: string[];
  state: RepoUrlPickerState;
  onChange: (state: RepoUrlPickerState) => void;
  rawErrors: string[];
}) => {
  const { allowedOwners = [], rawErrors, state, onChange } = props;
  const ownerItems: SelectItem[] = allowedOwners
    ? allowedOwners.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  const { owner, repoName } = state;

  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !owner}
      >
        {allowedOwners?.length ? (
          <Select
            native
            label="Owner Available"
            onChange={selected =>
              onChange({
                owner: String(Array.isArray(selected) ? selected[0] : selected),
              })
            }
            disabled={allowedOwners.length === 1}
            selected={owner}
            items={ownerItems}
          />
        ) : (
          <>
            <InputLabel htmlFor="ownerInput">Owner</InputLabel>
            <Input
              id="ownerInput"
              onChange={e => onChange({ owner: e.target.value })}
              value={owner}
            />
          </>
        )}
        <FormHelperText>
          The organization, groups, subgroups, user, project (also known as
          namespaces in gitlab), that this repo will belong to
        </FormHelperText>
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
