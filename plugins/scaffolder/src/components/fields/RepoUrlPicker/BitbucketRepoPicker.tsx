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

export const BitbucketRepoPicker = ({
  onProjectChange,
  onWorkspaceChange,
  onRepoNameChange,
  rawErrors,
  workspace,
  project,
  host,
  repoName,
}: {
  onProjectChange: (owner: string) => void;
  onWorkspaceChange: (name: string) => void;
  onRepoNameChange: (name: string) => void;
  workspace?: string;
  project?: string;
  repoName?: string;
  host: string;
  rawErrors: string[];
}) => {
  return (
    <>
      {host === 'bitbucket.org' && (
        <FormControl
          margin="normal"
          required
          error={rawErrors?.length > 0 && !workspace}
        >
          <InputLabel htmlFor="workspaceInput">Workspace</InputLabel>
          <Input
            id="workspaceInput"
            onChange={e => onWorkspaceChange(e.target.value)}
            value={workspace}
          />
          <FormHelperText>
            The Organization that this repo will belong to
          </FormHelperText>
        </FormControl>
      )}
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !project}
      >
        <InputLabel htmlFor="projectInput">Project</InputLabel>
        <Input
          id="projectInput"
          onChange={e => onProjectChange(e.target.value)}
          value={project}
        />
        <FormHelperText>
          The Project that this repo will belong to
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
