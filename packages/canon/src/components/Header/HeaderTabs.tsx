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
import { HeaderTabsIndicators } from './HeaderTabsIndicators';
import type { HeaderProps, HeaderTabProps } from './types';

/**
 * A component that renders header tabs.
 *
 * @public
 */
export const HeaderTabs = (props: HeaderProps) => {
  const { tabs } = props;
  const { classNames } = useStyles('Header');
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

  if (!tabs) return null;

  return (
    <Tabs className={classNames.tabs} ref={tabsRef} keyboardActivation="manual">
      <TabList className={classNames.tabList} aria-label="Toolbar tabs">
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
      <HeaderTabsIndicators
        tabRefs={tabRefs}
        tabsRef={tabsRef}
        hoveredKey={hoveredKey}
        prevHoveredKey={prevHoveredKey}
      />
    </Tabs>
  );
};

/**
 * A component that renders a toolbar tab.
 *
 * @public
 */
const Tab = (props: HeaderTabProps) => {
  const { tab, setTabRef, setHoveredKey } = props;
  const id = useId();
  const { classNames } = useStyles('Header');

  return (
    <AriaTab
      id={id}
      className={classNames.tab}
      ref={el => setTabRef(id, el as HTMLDivElement)}
      onHoverStart={() => setHoveredKey(id)}
      onHoverEnd={() => setHoveredKey(null)}
      href={tab.href}
    >
      {tab.label}
    </AriaTab>
  );
};
