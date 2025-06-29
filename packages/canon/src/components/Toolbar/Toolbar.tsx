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

import {
  Tabs,
  TabList,
  Tab as AriaTab,
  TabListStateContext,
} from 'react-aria-components';
import { useStyles } from '../../hooks/useStyles';
import {
  useId,
  useContext,
  useRef,
  useEffect,
  useState,
  useCallback,
  MutableRefObject,
} from 'react';
import { ToolbarProps, ToolbarTab } from './types';

export const Toolbar = (props: ToolbarProps) => {
  const { tabs } = props;
  const { classNames } = useStyles('Toolbar');
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const setTabRef = (key: string, element: HTMLDivElement | null) => {
    if (element) {
      tabRefs.current.set(key, element);
    } else {
      tabRefs.current.delete(key);
    }
  };

  return (
    <>
      <div>Toolbar</div>
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
          <Indicator
            tabRefs={tabRefs}
            tabsRef={tabsRef}
            hoveredKey={hoveredKey}
          />
        </Tabs>
      )}
    </>
  );
};

const Tab = ({
  tab,
  setTabRef,
  setHoveredKey,
}: {
  tab: ToolbarTab;
  setTabRef: (key: string, element: HTMLDivElement | null) => void;
  setHoveredKey: (key: string | null) => void;
}) => {
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

const Indicator = ({
  tabRefs,
  tabsRef,
  hoveredKey,
}: {
  tabRefs: MutableRefObject<Map<string, HTMLDivElement>>;
  tabsRef: MutableRefObject<HTMLDivElement | null>;
  hoveredKey: string | null;
}) => {
  const { classNames } = useStyles('Toolbar');
  const state = useContext(TabListStateContext);

  const updateCSSVariables = useCallback(() => {
    if (!tabsRef.current) return;

    const tabsRect = tabsRef.current.getBoundingClientRect();

    // Set active tab variables
    if (state?.selectedKey) {
      const activeTab = tabRefs.current.get(state.selectedKey.toString());
      console.log(activeTab);
      if (activeTab) {
        const activeRect = activeTab.getBoundingClientRect();
        const relativeLeft = activeRect.left - tabsRect.left;
        const relativeTop = activeRect.top - tabsRect.top;

        tabsRef.current.style.setProperty(
          '--active-tab-left',
          `${relativeLeft}px`,
        );
        tabsRef.current.style.setProperty(
          '--active-tab-right',
          `${relativeLeft + activeRect.width}px`,
        );
        tabsRef.current.style.setProperty(
          '--active-tab-top',
          `${relativeTop}px`,
        );
        tabsRef.current.style.setProperty(
          '--active-tab-bottom',
          `${relativeTop + activeRect.height}px`,
        );
        tabsRef.current.style.setProperty(
          '--active-tab-width',
          `${activeRect.width}px`,
        );
        tabsRef.current.style.setProperty(
          '--active-tab-height',
          `${activeRect.height}px`,
        );
      }
    }

    // Set hovered tab variables
    if (hoveredKey) {
      const hoveredTab = tabRefs.current.get(hoveredKey);
      if (hoveredTab) {
        const hoveredRect = hoveredTab.getBoundingClientRect();
        const relativeLeft = hoveredRect.left - tabsRect.left;
        const relativeTop = hoveredRect.top - tabsRect.top;

        tabsRef.current.style.setProperty(
          '--hovered-tab-left',
          `${relativeLeft}px`,
        );
        tabsRef.current.style.setProperty(
          '--hovered-tab-right',
          `${relativeLeft + hoveredRect.width}px`,
        );
        tabsRef.current.style.setProperty(
          '--hovered-tab-top',
          `${relativeTop}px`,
        );
        tabsRef.current.style.setProperty(
          '--hovered-tab-bottom',
          `${relativeTop + hoveredRect.height}px`,
        );
        tabsRef.current.style.setProperty(
          '--hovered-tab-width',
          `${hoveredRect.width}px`,
        );
        tabsRef.current.style.setProperty(
          '--hovered-tab-height',
          `${hoveredRect.height}px`,
        );
      }
    } else {
      // Clear hovered variables when no tab is hovered
      tabsRef.current.style.setProperty('--hovered-tab-left', '0px');
      tabsRef.current.style.setProperty('--hovered-tab-right', '0px');
      tabsRef.current.style.setProperty('--hovered-tab-top', '0px');
      tabsRef.current.style.setProperty('--hovered-tab-bottom', '0px');
      tabsRef.current.style.setProperty('--hovered-tab-width', '0px');
      tabsRef.current.style.setProperty('--hovered-tab-height', '0px');
    }
  }, [state?.selectedKey, hoveredKey]);

  useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  useEffect(() => {
    const handleResize = () => updateCSSVariables();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCSSVariables]);

  return (
    <>
      <div className={classNames.activeIndicator} />
      <div className={classNames.hoveredIndicator} />
    </>
  );
};
