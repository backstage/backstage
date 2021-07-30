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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Entity } from '@backstage/catalog-model';

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
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-outlined-label">
        Select a project
      </InputLabel>
      <Select
        required
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={value}
        error={isFormInvalid && value === ''}
        label="Project"
      >
        {entities?.map(entity => {
          const projectName = entity.metadata.name;
          return (
            <MenuItem
              button
              onClick={() => onChange(entity)}
              key={projectName}
              value={projectName}
            >
              {projectName}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
