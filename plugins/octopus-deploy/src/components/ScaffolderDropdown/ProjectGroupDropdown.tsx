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
import FormControl from '@material-ui/core/FormControl';
import { InputLabel, Input, FormHelperText } from '@material-ui/core';
import { Select, SelectItem } from '@backstage/core-components';
import { useProjectGroups } from '../../hooks/useProjectGroups';
import { ProjectGroupDropdownProps } from './schema';

export const ProjectGroupDropdown = ({
  onChange,
  rawErrors,
  required,
  formData,
}: ProjectGroupDropdownProps) => {
  const [selectedProjectGroup, setSelectedProjectGroup] =
    React.useState<string>('');
  const { projectGroups } = useProjectGroups();

  const projectGroupItems: SelectItem[] = projectGroups
    ? projectGroups.map(pg => ({ label: pg.Name, value: pg.Name }))
    : [];

  const updateProjectGroup = (pg: string) => {
    setSelectedProjectGroup(pg);
    onChange(pg);
  };

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
      {projectGroups?.length ? (
        <Select
          label="Project Group"
          onChange={p => {
            updateProjectGroup(String(Array.isArray(p) ? p[0] : p));
          }}
          disabled={projectGroups.length === 1}
          selected={selectedProjectGroup}
          items={projectGroupItems}
        />
      ) : (
        <>
          <InputLabel>Project Group</InputLabel>
          <Input
            id="project-group-input"
            onChange={e => onChange(e.target.value)}
            value={formData}
          />
        </>
      )}
      <FormHelperText>
        The project group of the within Octopus Deploy.
      </FormHelperText>
    </FormControl>
  );
};
