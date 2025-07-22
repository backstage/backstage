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

import type { HeaderPageProps } from './types';
import { Heading } from '../Heading';
import { Menu } from '../Menu';
import { ButtonIcon } from '../ButtonIcon';
import { RiMore2Line } from '@remixicon/react';
import { Tabs, TabList, Tab } from '../Tabs';
import { useStyles } from '../../hooks/useStyles';

/**
 * A component that renders a header page.
 *
 * @public
 */
export const HeaderPage = (props: HeaderPageProps) => {
  const { title, menuItems, tabs, customActions } = props;
  const { classNames } = useStyles('HeaderPage');

  return (
    <div className={classNames.root}>
      <div className={classNames.content}>
        <Heading variant="title4">{title}</Heading>
        <div className={classNames.controls}>
          {customActions}
          {menuItems && (
            <Menu.Root>
              <Menu.Trigger
                render={props => (
                  <ButtonIcon
                    {...props}
                    size="small"
                    icon={<RiMore2Line />}
                    variant="tertiary"
                  />
                )}
              />
              <Menu.Portal>
                <Menu.Positioner sideOffset={4} align="end">
                  <Menu.Popup>
                    {menuItems.map(menuItem => (
                      <Menu.Item
                        key={menuItem.value}
                        onClick={() => menuItem.onClick?.()}
                      >
                        {menuItem.label}
                      </Menu.Item>
                    ))}
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          )}
        </div>
      </div>
      {tabs && (
        <div className={classNames.tabsWrapper}>
          <Tabs>
            <TabList>
              {tabs.map(tab => (
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
    </div>
  );
};
