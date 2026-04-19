/*
 * Copyright 2022 The Backstage Authors
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

import { useEffect, useState } from 'react';
import { useLocalStorageValue } from '@react-hookz/web';

import { useShadowRootElements } from '@backstage/plugin-techdocs-react';

const NESTED_LIST_TOGGLE = '.md-nav__item--nested .md-toggle';

const EXPANDABLE_NAVIGATION_LOCAL_STORAGE =
  '@backstage/techdocs-addons/nav-expanded';

type expandableNavigationLocalStorage = {
  expandAllNestedNavs: boolean;
};

/**
 * Show expand/collapse navigation button next to site name in main
 * navigation menu if documentation site has nested navigation.
 */
export const ExpandableNavigationAddon = () => {
  const defaultValue = { expandAllNestedNavs: false };
  const { value: expanded, set: setExpanded } =
    useLocalStorageValue<expandableNavigationLocalStorage>(
      EXPANDABLE_NAVIGATION_LOCAL_STORAGE,
      { defaultValue },
    );
  const [hasNavSubLevels, setHasNavSubLevels] = useState<boolean>(false);

  const [...checkboxToggles] = useShadowRootElements<HTMLInputElement>([
    NESTED_LIST_TOGGLE,
  ]);

  // Define handleKeyPass as a named function
  function handleKeyPass(
    event: React.KeyboardEvent<HTMLElement>,
    toggleAction: () => void,
  ) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleAction();
    }
  }

  useEffect(() => {
    if (!checkboxToggles?.length) return;
    setHasNavSubLevels(true);
  }, [checkboxToggles]);

  useEffect(() => {
    if (!checkboxToggles?.length) return;
    function shouldToggle(item: HTMLInputElement) {
      return expanded?.expandAllNestedNavs !== item.checked;
    }
    for (const item of checkboxToggles) {
      if (shouldToggle(item)) {
        item.click();
      }
    }
  }, [expanded, checkboxToggles]);

  const handleState = () => {
    setExpanded(prevState => ({
      expandAllNestedNavs: !prevState?.expandAllNestedNavs,
    }));
  };

  function handleButtonKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    handleKeyPass(event, handleState);
  }

  return (
    <>
      {hasNavSubLevels ? (
        <button
          type="button"
          onClick={handleState}
          onKeyDown={handleButtonKeyDown}
          tabIndex={0}
          aria-expanded={expanded?.expandAllNestedNavs}
          aria-label={
            expanded?.expandAllNestedNavs ? 'collapse-nav' : 'expand-nav'
          }
          style={{
            position: 'absolute',
            left: '13.7rem',
            top: '19px',
            zIndex: 2,
            padding: 0,
            minWidth: 0,
            width: '24px',
            height: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'transparent',
            borderRadius: '4px',
            cursor: 'pointer',
            color: 'var(--muted-foreground, #666)',
          }}
        >
          {expanded?.expandAllNestedNavs ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
        </button>
      ) : null}
    </>
  );
};
