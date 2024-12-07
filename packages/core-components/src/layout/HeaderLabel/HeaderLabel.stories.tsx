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
import { HeaderLabel } from './HeaderLabel';

export default {
  title: 'Layout/HeaderLabel',
  component: HeaderLabel,
};

type HeaderLabelProps = {
  label: string;
  value?: string;
  url?: string;
};

export const Default = (args: HeaderLabelProps) => <HeaderLabel {...args} />;
Default.args = {
  label: 'This is label',
  value: 'This is value',
  url: 'https://backstage.io',
};
