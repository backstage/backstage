/*
 * Copyright 2020 Spotify AB
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
import { Header, Page, pageTheme, HeaderLabel } from '@backstage/core';

export const Layout: React.FC = ({ children }) => {
  return (
    <Page theme={pageTheme.tool}>
      <Header title="CircleCI" subtitle="See recent builds and their status">
        <HeaderLabel label="Owner" value="Spotify" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      {children}
    </Page>
  );
};
