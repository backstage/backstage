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
import {
  Progress,
  Select,
  SelectedItems,
  SelectItem,
} from '@backstage/core-components';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

export const RepoUrlPickerHost = ({
  host,
  organization,
  hosts,
  onChange,
  rawErrors,
}) => {
  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !host}
      >
        <Select
          native
          disabled={hosts.length === 1}
          label="Host"
          onChange={onChange}
          selected={host}
          items={hosts}
        />

        <FormHelperText>
          The host where the repository will be created
        </FormHelperText>
      </FormControl>
      {/* Show this for dev.azure.com only */}
      {host === 'dev.azure.com' && (
        <FormControl
          margin="normal"
          required
          error={rawErrors?.length > 0 && !organization}
        >
          <InputLabel htmlFor="repoInput">Organization</InputLabel>
          <Input
            id="repoInput"
            onChange={updateOrganization}
            value={organization}
          />
          <FormHelperText>The name of the organization</FormHelperText>
        </FormControl>
      )}
    </>
  );
};
