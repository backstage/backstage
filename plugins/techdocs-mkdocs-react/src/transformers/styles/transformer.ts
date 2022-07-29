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

import { useCallback, useMemo } from 'react';

import { useTheme } from '@material-ui/core';

import { useSidebarPinState } from '@backstage/core-components';
import { BackstageTheme } from '@backstage/theme';

import { Transformer } from '../transformer';
import { rules } from './rules';

/**
 * Sidebar pinned state to be used in computing style injections.
 */
const useSidebar = () => useSidebarPinState();

/**
 * Process all rules and concatenate their definitions into a single style.
 * @returns a string containing all processed style definitions.
 */
const useRuleStyles = () => {
  const sidebar = useSidebar();
  const theme = useTheme<BackstageTheme>();

  return useMemo(() => {
    const options = { theme, sidebar };
    return rules.reduce<string>((styles, rule) => styles + rule(options), '');
  }, [theme, sidebar]);
};

/**
 * Returns a transformer that inserts all style rules into the given element's head tag.
 */
export const useStylesTransformer = (): Transformer => {
  const styles = useRuleStyles();

  return useCallback(
    (dom: Element) => {
      dom
        .getElementsByTagName('head')[0]
        .insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
      return dom;
    },
    [styles],
  );
};
