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
import {
  createScaffolderLayout,
  ObjectFieldTemplate,
  scaffolderPlugin,
} from '@backstage/plugin-scaffolder';

const ALayout: ObjectFieldTemplate = ({ properties, description }) => {
  // eslint-disable-next-line no-console
  return (
    <div>
      <h1>CUSTOM LAYOUT!!!!!</h1>
      <div>
        {properties.map(prop => (
          <div key={prop.content.key}>{prop.content}</div>
        ))}
      </div>
      {description}
    </div>
  );
};

const AnotherCustomLayout: ObjectFieldTemplate = ({
  properties,
  description,
}) => {
  // eslint-disable-next-line no-console
  return (
    <div>
      <h1>ANOTHER CUSTOM LAYOUT!!!!!</h1>
      <div>
        {properties.map(prop => (
          <div key={prop.content.key}>{prop.content}</div>
        ))}
      </div>
      {description}
    </div>
  );
};

export const CustomLayout = scaffolderPlugin.provide(
  createScaffolderLayout({
    name: 'CustomLayout',
    component: ALayout,
  }),
);

export const AnotherCustomlayout = scaffolderPlugin.provide(
  createScaffolderLayout({
    name: 'AnotherCustomLayout',
    component: AnotherCustomLayout,
  }),
);
