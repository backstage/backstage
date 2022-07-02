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
import React, { useEffect } from 'react';
import { Select, SelectItem } from '@backstage/core-components';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

export const RepoUrlPickerRepoName = (props: {
  repoName?: string;
  allowedRepos?: string[];
  onChange: (host: string) => void;
  rawErrors: string[];
}) => {
  const { repoName, allowedRepos, onChange, rawErrors } = props;

  useEffect(() => {
    // If there is no repoName chosen currently
    if (!repoName) {
      // Set the first of the allowedRepos option if that available
      if (allowedRepos?.length) {
        onChange(allowedRepos[0]);
      }
    }
  }, [allowedRepos, repoName, onChange]);

  const repoItems: SelectItem[] = allowedRepos
    ? allowedRepos.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !repoName}
      >
        {allowedRepos?.length ? (
          <Select
            native
            label="Repositories Available"
            onChange={selected =>
              String(Array.isArray(selected) ? selected[0] : selected)
            }
            disabled={allowedRepos.length === 1}
            selected={repoName}
            items={repoItems}
          />
        ) : (
          <>
            <InputLabel htmlFor="repoNameInput">Repository</InputLabel>
            <Input
              id="repoNameInput"
              onChange={e => onChange(String(e.target.value))}
              value={repoName}
            />
          </>
        )}
        <FormHelperText>The name of the repository</FormHelperText>
      </FormControl>
    </>
  );
};
