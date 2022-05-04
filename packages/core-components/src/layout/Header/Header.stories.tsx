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
import React from 'react';
import { HeaderLabel } from '../HeaderLabel';
import { Page } from '../Page';
import { Header } from './Header';

export default {
  title: 'Layout/Header',
  component: Header,
  argTypes: {
    type: {
      options: [
        'home',
        'tool',
        'service',
        'website',
        'library',
        'app',
        'apis',
        'documentation',
        'other',
      ],
      control: { type: 'select' },
    },
  },
};

const labels = (
  <>
    <HeaderLabel label="Owner" value="players" />
    <HeaderLabel label="Lifecycle" value="Production" />
    <HeaderLabel label="Tier" value="Level 1" />
  </>
);

export const Default = (args: {
  type: string;
  title: string;
  subtitle: string;
}) => {
  const { type } = args;
  return (
    <Page themeId={type}>
      <Header {...args}>{labels}</Header>
    </Page>
  );
};

Default.args = {
  type: 'home',
  title: 'This is a title',
  subtitle: 'This is a subtitle',
};
