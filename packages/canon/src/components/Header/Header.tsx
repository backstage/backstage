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

import type { HeaderProps } from './types';
import { HeaderToolbar } from './HeaderToolbar';
import { HeaderTabs } from './HeaderTabs';
import { HeaderSubNav } from './HeaderSubNav';

/**
 * A component that renders a toolbar.
 *
 * @public
 */
export const Header = (props: HeaderProps) => {
  const { tabs, icon, name, options, breadcrumbs, subNavigation } = props;

  return (
    <>
      <HeaderToolbar
        icon={icon}
        name={name}
        options={options}
        breadcrumbs={breadcrumbs}
      />
      <HeaderTabs tabs={tabs} />
      <HeaderSubNav subNavigation={subNavigation} />
    </>
  );
};
