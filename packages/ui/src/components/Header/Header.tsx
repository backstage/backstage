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
import { Tabs, TabList, Tab } from '../Tabs';
import { useStyles } from '../../hooks/useStyles';
import { type NavigateOptions } from 'react-router-dom';

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

/**
 * A component that renders a toolbar.
 *
 * @public
 */
export const Header = (props: HeaderProps) => {
  const {
    tabs,
    icon,
    title,
    titleLink,
    menuItems,
    breadcrumbs,
    customActions,
    onTabSelectionChange,
  } = props;

  const { classNames } = useStyles('Header');

  const hasTabs = tabs && tabs.length > 0;

  return (
    <>
      <HeaderToolbar
        icon={icon}
        title={title}
        titleLink={titleLink}
        menuItems={menuItems}
        breadcrumbs={breadcrumbs}
        customActions={customActions}
        hasTabs={hasTabs}
      />
      {tabs && (
        <div className={classNames.tabsWrapper}>
          <Tabs onSelectionChange={onTabSelectionChange}>
            <TabList>
              {tabs?.map(tab => (
                <Tab
                  key={tab.id}
                  id={tab.id}
                  href={tab.href}
                  matchStrategy={tab.matchStrategy}
                >
                  {tab.label}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </div>
      )}
    </>
  );
};
