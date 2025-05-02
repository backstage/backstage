/*
 * Copyright 2024 The Backstage Authors
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

import { ReactNode } from 'react';
import { ContentHeader } from '../ContentHeader';

export default {
  title: 'Layout/ContentHeader',
  component: ContentHeader,
};

type ContentHeaderProps = {
  title?: string;
  titleComponent?: ReactNode;
  description?: string;
  textAlign?: 'left' | 'right' | 'center';
};

export const Default = (args: ContentHeaderProps) => (
  <ContentHeader {...args}>
    <div>Child of Content Header</div>
  </ContentHeader>
);
Default.args = {
  title: 'This is Content Header default aligned',
  description: 'This is description',
};

export const Left = (args: ContentHeaderProps) => (
  <ContentHeader {...args}>
    <div>Child of Content Header</div>
  </ContentHeader>
);
Left.args = {
  title: 'This is Content Header left aligned',
  description: 'This is description',
  textAlign: 'left',
};

export const Right = (args: ContentHeaderProps) => (
  <ContentHeader {...args}>
    <div>Child of Content Header</div>
  </ContentHeader>
);
Right.args = {
  title: 'This is Content Header right aligned',
  description: 'This is description',
  textAlign: 'right',
};

export const Center = (args: ContentHeaderProps) => (
  <ContentHeader {...args}>
    <div>Child of Content Header</div>
  </ContentHeader>
);
Center.args = {
  title: 'This is Content Header center aligned',
  description: 'This is description',
  textAlign: 'center',
};
