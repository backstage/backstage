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

import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Project } from '../../contexts/ProjectContext';

import { VersioningStrategy } from './VersioningStrategy';
import { Owner } from './Owner';
import { Repo } from './Repo';

export function RepoDetailsForm({
  control,
  username,
}: {
  control: ReturnType<typeof useForm>['control'];
  username: string;
}) {
  return (
    <Controller
      render={controllerRenderProps => {
        const project: Project = controllerRenderProps.value;

        return (
          <>
            <VersioningStrategy controllerRenderProps={controllerRenderProps} />

            <Owner
              controllerRenderProps={controllerRenderProps}
              username={username}
            />

            {project.owner.length > 0 && (
              <Repo
                controllerRenderProps={controllerRenderProps}
                username={username}
              />
            )}
          </>
        );
      }}
      control={control}
      name="repo-details-form"
      defaultValue={
        {
          owner: '',
          repo: '',
          versioningStrategy: 'semver',
        } as Project
      }
    />
  );
}
