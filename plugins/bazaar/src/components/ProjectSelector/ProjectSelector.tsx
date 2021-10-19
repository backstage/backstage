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
import { Entity } from '@backstage/catalog-model';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';

type Props = {
  entities: Entity[];
  value: string;
  onChange: (entity: Entity) => void;
  isFormInvalid: boolean;
};

export const ProjectSelector = ({
  entities,
  value,
  onChange,
  isFormInvalid,
}: Props) => {
  return (
    <Autocomplete
      defaultValue={entities[0]}
      options={entities}
      getOptionLabel={option => option?.metadata?.name}
      renderOption={option => <span>{option?.metadata?.name}</span>}
      renderInput={params => (
        <TextField
          error={isFormInvalid && value === ''}
          helperText={
            isFormInvalid && value === '' ? 'Please select a project' : ''
          }
          {...params}
          label="Select a project"
        />
      )}
      onChange={(_, data) => onChange(data!)}
    />
  );
};
