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
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { Select, SelectItem } from '@backstage/core-components';
import { useProjectGroups } from '../../hooks/useProjectGroups';
import { ScaffolderField } from '@backstage/plugin-scaffolder-react/alpha';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';

export const ProjectGroupDropdown = ({
  onChange,
  errors,
  rawErrors,
  required,
  help,
  rawDescription,
  disabled,
}: FieldExtensionComponentProps<string>) => {
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
    <ScaffolderField
      rawErrors={rawErrors}
      errors={errors}
      required={required}
      help={help}
      rawDescription={rawDescription}
      disabled={disabled}
    >
      {projectGroups?.length ? (
        <Select
          label="Project Group"
          onChange={p => {
            // param p is an array if the select is multi-select,
            // since this is single-select we can just take the first element
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
            onChange={e => updateProjectGroup(e.target.value)}
            value={selectedProjectGroup}
          />
        </>
      )}
    </ScaffolderField>
  );
};
