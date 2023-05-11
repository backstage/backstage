/*
 * Copyright 2023 The Backstage Authors
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
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import {
  GroupsImPartOfPickerProps,
  GroupsImPartOfPickerSchema,
} from './schema';

export { GroupsImPartOfPickerSchema };

export const GroupsImPartOfPicker = (props: GroupsImPartOfPickerProps) => {
  const {
    schema: { title = 'Group', description = 'A group you are part of' },
    required,
  } = props;

  const identityApi = useApi(identityApiRef);
  const { loading, value: identityRefs } = useAsync(async () => {
    const identity = await identityApi.getBackstageIdentity();
    return identity.ownershipEntityRefs;
  });

  const [selectedGroup, setSelectedGroup] = React.useState('');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedGroup(event.target.value as string);
  };

  if (loading) {
    return (
      <TextField
        label={title}
        margin="dense"
        helperText={description}
        FormHelperTextProps={{ margin: 'dense', style: { marginLeft: 0 } }}
        variant="outlined"
        required={required}
        disabled
      />
    );
  }

  return (
    <FormControl variant="outlined" margin="dense" required={required}>
      <InputLabel>{title}</InputLabel>
      <Select value={selectedGroup} onChange={handleChange} label={title}>
        {identityRefs?.map((ref: string) => (
          <MenuItem key={ref} value={ref}>
            {ref}
          </MenuItem>
        )) || []}
      </Select>
    </FormControl>
  );
};
