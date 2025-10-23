/*
 * Copyright 2025 The Backstage Authors
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
import styles from './Header.module.css';
import clsx from 'clsx';
import { Helmet } from 'react-helmet';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

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
  const { classNames, cleanedProps } = useStyles('Header', props);
  const {
    tabs,
    icon,
    title = 'Your plugin',
    titleLink,
    customActions,
    onTabSelectionChange,
  } = cleanedProps;

  const configApi = useApi(configApiRef);
  const appTitle = configApi.getOptionalString('app.title') || 'Backstage';
  const pluginTitle = `${title} | ${appTitle}`;
  const pluginPageTitleTemplate = `%s | ${pluginTitle}`;

  const hasTabs = tabs && tabs.length > 0;

  return (
    <>
      <Helmet
        titleTemplate={pluginPageTitleTemplate}
        defaultTitle={pluginTitle}
      />
      <HeaderToolbar
        icon={icon}
        title={title}
        titleLink={titleLink}
        customActions={customActions}
        hasTabs={hasTabs}
      />
      {tabs && (
        <div
          className={clsx(
            classNames.tabsWrapper,
            styles[classNames.tabsWrapper],
          )}
        >
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
