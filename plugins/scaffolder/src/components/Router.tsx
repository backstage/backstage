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
import { Routes, Route, useOutlet } from 'react-router';
import { ScaffolderPage } from './ScaffolderPage';
import { TemplatePage } from './TemplatePage';
import { TaskPage } from './TaskPage';
import { ActionsPage } from './ActionsPage';
import { getComponentData } from '@backstage/core';
import { FieldExtensionOptions } from '../extensions';

export const Router = () => {
  const children = useOutlet();
  const fieldExtensions = React.Children.map(children ?? [], child => {
    if (!React.isValidElement(child)) {
      return null;
    }

    const data = getComponentData<FieldExtensionOptions<unknown>>(
      child,
      'scaffolder.extensions.field.v1',
    );

    return data;
  }).filter(Boolean);

  return (
    <Routes>
      <Route path="/" element={<ScaffolderPage />} />
      <Route
        path="/templates/:templateName"
        element={<TemplatePage customFieldExtensions={fieldExtensions} />}
      />
      <Route path="/tasks/:taskId" element={<TaskPage />} />
      <Route path="/actions" element={<ActionsPage />} />
    </Routes>
  );
};
