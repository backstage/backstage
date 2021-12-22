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

export const GithubRepoPicker = ({
  onOwnerChange,
  onRepoNameChange,
  allowedOwners = [],
  rawErrors,
  owner,
  repoName,
}: {
  onOwnerChange: (owner: string) => void;
  onRepoNameChange: (name: string) => void;
  allowedOwners: string[];
  owner?: string;
  repoName?: string;
  rawErrors: string[];
}) => {
  const ownerItems: SelectItem[] = allowedOwners
    ? allowedOwners.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

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
            onChange={s => onOwnerChange(String(Array.isArray(s) ? s[0] : s))}
            disabled={allowedOwners.length === 1}
            selected={owner}
            items={ownerItems}
          />
        ) : (
          <>
            <InputLabel htmlFor="ownerInput">Owner</InputLabel>
            <Input
              id="ownerInput"
              onChange={e => onOwnerChange(e.target.value)}
              value={owner}
            />
          </>
        )}
        <FormHelperText>
          The organization, user or project that this repo will belong to
        </FormHelperText>
      </FormControl>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !repoName}
      >
        <InputLabel htmlFor="repoInput">Repository</InputLabel>
        <Input
          id="repoInput"
          onChange={e => onRepoNameChange(e.target.value)}
          value={repoName}
        />
        <FormHelperText>The name of the repository</FormHelperText>
      </FormControl>
    </>
  );
};
