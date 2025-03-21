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
import React from 'react';
import { Content } from './Content';

export default {
  title: 'Layout/Content',
  component: Content,
};

type Props = {
  stretch?: boolean;
  noPadding?: boolean;
  className?: string;
};

export const Default = (args: Props) => (
  <Content {...args}>
    <div>This is child of content component</div>
  </Content>
);

Default.args = {
  stretch: false,
  noPadding: false,
};

export const WithNoPadding = (args: Props) => (
  <Content {...args}>
    <div>This is child of content component</div>
  </Content>
);

WithNoPadding.args = {
  stretch: true,
  noPadding: true,
};
