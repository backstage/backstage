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

import React, { useEffect, useState } from 'react';
import { useLocalStorageValue } from '@react-hookz/web';
import { Button, withStyles } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { useShadowRoot } from '@backstage/plugin-techdocs-react';

const NESTED_LIST_TOGGLE = '.md-nav__item--nested .md-toggle';

const EXPANDABLE_NAVIGATION_LOCAL_STORAGE =
  '@backstage/techdocs-addons/nav-expanded';

const StyledButton = withStyles({
  root: {
    position: 'absolute',
    left: '220px',
    top: '19px',
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
  navExpanded: boolean;
};

export const ExpandableNavigationAddon = () => {
  const shadowRoot = useShadowRoot();
  const defaultValue = { navExpanded: false };
  const [expanded, setExpanded] =
    useLocalStorageValue<expandableNavigationLocalStorage>(
      EXPANDABLE_NAVIGATION_LOCAL_STORAGE,
      defaultValue,
    );
  const [hasNavSubLevels, setHasNavSubLevels] = useState<boolean>(false);

  useEffect(() => {
    const checkboxToggles =
      shadowRoot?.querySelectorAll<HTMLInputElement>(NESTED_LIST_TOGGLE);
    if (!checkboxToggles || (checkboxToggles && checkboxToggles.length === 0))
      return;
    setHasNavSubLevels(true);
    checkboxToggles.forEach(item => {
      if (
        (expanded?.navExpanded && !item.checked) ||
        (!expanded?.navExpanded && item.checked)
      ) {
        item.click();
      }
    });
  }, [shadowRoot, expanded]);

  const handleState = () => {
    setExpanded(prevState => ({
      navExpanded: !prevState?.navExpanded,
    }));
  };

  return (
    <>
      {hasNavSubLevels ? (
        <StyledButton
          size="small"
          onClick={handleState}
          aria-label={expanded?.navExpanded ? 'collapse-nav' : 'expand-nav'}
        >
          {expanded?.navExpanded ? <ExpandedIcon /> : <CollapsedIcon />}
        </StyledButton>
      ) : null}
    </>
  );
};
