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

import { Tabs, TabList, Tab as AriaTab } from 'react-aria-components';
import { useStyles } from '../../hooks/useStyles';
import { useId, useRef, useState } from 'react';
import { ToolbarTabsIndicators } from './Indicators';
import { RiMore2Line, RiShapesLine } from '@remixicon/react';
import type { ToolbarProps, ToolbarTabProps } from './types';
import { ButtonIcon } from '../ButtonIcon';
import { Menu } from '../Menu';

/**
 * A component that renders a toolbar.
 *
 * @public
 */
export const Toolbar = (props: ToolbarProps) => {
  const { tabs, icon, name, options } = props;
  const { classNames } = useStyles('Toolbar');
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const prevHoveredKey = useRef<string | null>(null);

  const setTabRef = (key: string, element: HTMLDivElement | null) => {
    if (element) {
      tabRefs.current.set(key, element);
    } else {
      tabRefs.current.delete(key);
    }
  };

  return (
    <>
      <div className={classNames.toolbar}>
        <div className={classNames.toolbarContentWrapper}>
          <div className={classNames.toolbarContent}>
            <div className={classNames.name}>
              <div className={classNames.icon}>{icon || <RiShapesLine />}</div>
              {name || 'Your plugin'}
            </div>
          </div>
          <div className={classNames.toolbarOptions}>
            {options && (
              <Menu.Root>
                <Menu.Trigger
                  render={props => (
                    <ButtonIcon
                      {...props}
                      size="small"
                      icon={<RiMore2Line />}
                      variant="secondary"
                    />
                  )}
                />
                <Menu.Portal>
                  <Menu.Positioner sideOffset={4} align="end">
                    <Menu.Popup>
                      {options.map(option => (
                        <Menu.Item
                          key={option.value}
                          onClick={() => option.onClick?.()}
                        >
                          {option.label}
                        </Menu.Item>
                      ))}
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            )}
          </div>
        </div>
      </div>
      {tabs && (
        <Tabs className={classNames.tabs} ref={tabsRef}>
          <TabList className={classNames.tabList}>
            {tabs.map((tab, index) => {
              return (
                <Tab
                  key={index}
                  tab={tab}
                  setTabRef={setTabRef}
                  setHoveredKey={setHoveredKey}
                />
              );
            })}
          </TabList>
          <ToolbarTabsIndicators
            tabRefs={tabRefs}
            tabsRef={tabsRef}
            hoveredKey={hoveredKey}
            prevHoveredKey={prevHoveredKey}
          />
        </Tabs>
      )}
    </>
  );
};

/**
 * A component that renders a toolbar tab.
 *
 * @public
 */
const Tab = (props: ToolbarTabProps) => {
  const { tab, setTabRef, setHoveredKey } = props;
  const id = useId();
  const { classNames } = useStyles('Toolbar');

  return (
    <AriaTab
      id={id}
      className={classNames.tab}
      ref={el => setTabRef(id, el as HTMLDivElement)}
      onHoverStart={() => setHoveredKey(id)}
      onHoverEnd={() => setHoveredKey(null)}
    >
      {tab.label}
    </AriaTab>
  );
};
