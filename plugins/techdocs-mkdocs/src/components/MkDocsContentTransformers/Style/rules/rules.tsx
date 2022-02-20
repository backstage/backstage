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

import { useContext } from 'react';

import { useTheme } from '@material-ui/core';

import {
  SidebarPinStateContext,
  SidebarPinStateContextType,
} from '@backstage/core-components';
import { BackstageTheme } from '@backstage/theme';

import { variable } from './variable';
import { reset } from './reset';
import { layout } from './layout';
import { typeset } from './typeset';
import { animation } from './animation';
import { extension } from './extension';

export type RuleParams = {
  theme: BackstageTheme;
  sidebar: Pick<SidebarPinStateContextType, 'isPinned'>;
};

export type RuleFunction = (params: RuleParams) => string;

const rules = [variable, reset, layout, typeset, animation, extension];

export const useCssRules = () => {
  const theme = useTheme<BackstageTheme>();
  const sidebar = useContext(SidebarPinStateContext);
  return rules.reduce<string>(
    (style, rule) => style.concat(rule({ theme, sidebar })),
    '',
  );
};
