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

import { useTabList, useTab } from 'react-aria';
import { useTabListState } from 'react-stately';
import { useLocation } from 'react-router-dom';
import { useStyles } from '../../hooks/useStyles';
import { useRef, useState } from 'react';
import { HeaderTabsIndicators } from './HeaderTabsIndicators';
import type { HeaderTabProps, HeaderTabsProps } from './types';

/**
 * A component that renders header tabs.
 *
 * @internal
 */
export const HeaderTabs = (props: HeaderTabsProps) => {
  const { classNames } = useStyles('Header');
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const prevHoveredKey = useRef<string | null>(null);

  let state = useTabListState(props);
  let ref = useRef(null);
  const { tabListProps } = useTabList({}, state, ref);

  const setTabRef = (key: string, element: HTMLDivElement | null) => {
    if (element) {
      tabRefs.current.set(key, element);
    } else {
      tabRefs.current.delete(key);
    }
  };

  return (
    <div className={classNames.tabs} ref={tabsRef}>
      <div className={classNames.tabList} {...tabListProps} ref={ref}>
        {Array.from(state.collection).map(item => (
          <Tab
            key={item.key}
            item={item}
            state={state}
            setTabRef={setTabRef}
            setHoveredKey={setHoveredKey}
          />
        ))}
      </div>
      <HeaderTabsIndicators
        tabRefs={tabRefs}
        tabsRef={tabsRef}
        hoveredKey={hoveredKey}
        prevHoveredKey={prevHoveredKey}
        state={state}
      />
    </div>
  );
};

/**
 * A component that renders a toolbar tab.
 *
 * @internal
 */
function Tab({ item, state, setTabRef, setHoveredKey }: HeaderTabProps) {
  let { key, rendered } = item;
  const { classNames } = useStyles('Header');
  const location = useLocation();

  let ref = useRef<HTMLDivElement>(null);
  let { tabProps } = useTab({ key }, state, ref);

  const setRef = (el: HTMLDivElement | null) => {
    // Set the ref for React Aria - use more specific type assertion
    (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    // Set the ref for tracking tab elements
    setTabRef(key.toString(), el);
  };

  // Check if the current path matches the tab's href
  const isSelected = item.props?.href
    ? location.pathname === item.props.href
    : state.selectedKey === key;

  return (
    <div
      className={classNames.tab}
      ref={setRef}
      data-selected={isSelected}
      onMouseEnter={() => setHoveredKey(key.toString())}
      onMouseLeave={() => setHoveredKey(null)}
      {...tabProps}
    >
      {rendered}
    </div>
  );
}
