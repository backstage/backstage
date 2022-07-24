/*
 * Copyright 2020 The Backstage Authors
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

import React, { Children, PropsWithChildren } from 'react';
import { Route, Routes, useRoutes } from 'react-router-dom';

import { isTechDocsAddonExtension } from '@backstage/plugin-techdocs-react';

import { DefaultEntityDocsPage } from './EntityPageDocs';
import { TechDocsIndexPage } from './home/components/TechDocsIndexPage';
import { TechDocsReaderPage } from './reader/components/TechDocsReaderPage';

/**
 * Responsible for registering routes for TechDocs, TechDocs Homepage and separate TechDocs page
 *
 * @public
 */
export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<TechDocsIndexPage />} />
      <Route
        path="/:namespace/:kind/:name/*"
        element={<TechDocsReaderPage />}
      />
    </Routes>
  );
};

/**
 * Responsible for registering route to view docs on Entity page
 *
 * @public
 */
export const EmbeddedDocsRouter = ({ children }: PropsWithChildren<{}>) => {
  const childrenList = Children.toArray(children);

  const page = childrenList.find(child => !isTechDocsAddonExtension(child));
  const addons = childrenList.find(child => isTechDocsAddonExtension(child));

  // Using objects instead of <Route> elements, otherwise "outlet" will be null on sub-pages and add-ons won't render
  const element = useRoutes([
    {
      path: '/*',
      element: page || <DefaultEntityDocsPage />,
      children: [
        {
          path: '/*',
          element: addons,
        },
      ],
    },
  ]);

  return element;
};
