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

import { BackstageTheme } from '@backstage/theme';

/**
 * A Backstage sidebar object that contains properties such as its pin state.
 */
type BackstageSidebar = {
  /** Tracks whether the user pinned the sidebar or not. */
  isPinned: boolean;
};

/**
 * A dependencies object injected into rules by the style processor.
 */
export type RuleOptions = {
  /**
   * A Backstage theme object that contains the application's design tokens.
   */
  theme: BackstageTheme;
  /**
   * A Backstage sidebar, see {@link BackstageSidebar} for more details.
   */
  sidebar: BackstageSidebar;
};
