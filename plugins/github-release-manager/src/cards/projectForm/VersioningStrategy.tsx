/*
 * Copyright 2021 Spotify AB
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

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { Project } from '../../contexts/ProjectContext';

export function VersioningStrategy({
  controllerRenderProps,
}: {
  controllerRenderProps: ControllerRenderProps;
}) {
  const project: Project = controllerRenderProps.value;

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Calendar strategy</FormLabel>
      <RadioGroup
        aria-label="calendar-strategy"
        name="calendar-strategy"
        value={project.versioningStrategy}
        onChange={event => {
          controllerRenderProps.onChange({
            ...project,
            versioningStrategy: event.target.value,
          } as Project);
        }}
      >
        <FormControlLabel
          value="semver"
          control={<Radio />}
          label="Semantic versioning"
        />
        <FormControlLabel
          value="calver"
          control={<Radio />}
          label="Calendar versioning"
        />
      </RadioGroup>
    </FormControl>
  );
}
