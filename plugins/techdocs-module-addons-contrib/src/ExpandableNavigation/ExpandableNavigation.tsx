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

import React, { useEffect, useCallback, useState } from 'react';
import { useLocalStorageValue } from '@react-hookz/web';
import { Button, withStyles } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { useShadowRootElements } from '@backstage/plugin-techdocs-react';

const NESTED_LIST_TOGGLE = '.md-nav__item--nested .md-toggle';

const EXPANDABLE_NAVIGATION_LOCAL_STORAGE =
  '@backstage/techdocs-addons/nav-expanded';

const StyledButton = withStyles({
  root: {
    position: 'absolute',
    left: '13.7rem', // Sidebar inner width (15.1em) minus the different margins/paddings
    top: '19px',
    zIndex: 2,
    padding: 0,
    minWidth: 0,
  },
})(Button);

const CollapsedIcon = withStyles({
  root: {
    height: '20px',
    width: '20px',
  },
})(ChevronRightIcon);

const ExpandedIcon = withStyles({
  root: {
    height: '20px',
    width: '20px',
  },
})(ExpandMoreIcon);

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

  const shouldToggle = useCallback(
    (item: HTMLInputElement) => {
      const isExpanded = item.checked;
      const shouldExpand = expanded?.expandAllNestedNavs;

      // Is collapsed but should expand
      if (shouldExpand && !isExpanded) {
        return true;
      }

      // Is expanded but should collapse
      if (!shouldExpand && isExpanded) {
        return true;
      }

      return false;
    },
    [expanded],
  );

  useEffect(() => {
    // There is no nested navs
    if (!checkboxToggles?.length) return;

    setHasNavSubLevels(true);
    checkboxToggles.forEach(item => {
      if (shouldToggle(item)) item.click();
    });
  }, [expanded, shouldToggle, checkboxToggles]);

  const handleState = () => {
    setExpanded(prevState => ({
      expandAllNestedNavs: !prevState?.expandAllNestedNavs,
    }));
  };

  return (
    <>
      {hasNavSubLevels ? (
        <StyledButton
          size="small"
          onClick={handleState}
          aria-label={
            expanded?.expandAllNestedNavs ? 'collapse-nav' : 'expand-nav'
          }
        >
          {expanded?.expandAllNestedNavs ? <ExpandedIcon /> : <CollapsedIcon />}
        </StyledButton>
      ) : null}
    </>
  );
};
