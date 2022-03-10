/*
 * Copyright 2022 The Backstage Authors
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
import { Route, Routes } from 'react-router';
import { OrgImportPage } from './OrgImportPage';
import { ComponentImportPage } from './ComponentImportPage';
import { DefaultImportPage } from './DefaultImportPage';
import { ComponentImportSelectGithubOrgPage } from './ComponentImportSelectGithubOrgPage';
import { ComponentImportSelectGithubRepoPage } from './ComponentImportSelectGithubRepoPage';
import { ComponentImportSelectGithubMethodPage } from './ComponentImportSelectGithubMethodPage';
import { ComponentImportGithubDiscoveryPage } from './ComponentImportGithubDiscoverPage';

export type RouterProps = {};

export const Router = (props: RouterProps) => {
  const {} = props;

  return (
    <Routes>
      <Route path="/" element={<DefaultImportPage />} />
      <Route path="/components" element={<ComponentImportPage />} />
      <Route
        path="/components/github/:host"
        element={<ComponentImportSelectGithubOrgPage />}
      />
      <Route
        path="/components/github/:host/:org/method"
        element={<ComponentImportSelectGithubMethodPage />}
      />
      <Route
        path="/components/github/:host/:org/repositories"
        element={<ComponentImportSelectGithubRepoPage />}
      />
      <Route
        path="/components/github/:host/:org/discovery"
        element={<ComponentImportGithubDiscoveryPage />}
      />
      <Route path="/organization" element={<OrgImportPage />} />
      {/* <Route path="/tasks/:taskId" element={<TaskPageElement />} /> */}
    </Routes>
  );
};
