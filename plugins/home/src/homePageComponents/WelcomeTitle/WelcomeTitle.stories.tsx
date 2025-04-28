/*
 * Copyright 2023 The Backstage Authors
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

import { Header } from '@backstage/core-components';
import { wrapInTestApp } from '@backstage/test-utils';
import { ComponentType, PropsWithChildren } from 'react';
import { WelcomeTitle } from './WelcomeTitle';

export default {
  title: 'Plugins/Home/Components/WelcomeTitle',
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) => wrapInTestApp(<Story />),
  ],
};

export const Default = () => {
  return <Header title={<WelcomeTitle />} pageTitleOverride="Home" />;
};

export const withLanguage = () => {
  const languages = ['English', 'Spanish'];
  return (
    <Header
      title={<WelcomeTitle language={languages} />}
      pageTitleOverride="Home"
    />
  );
};
