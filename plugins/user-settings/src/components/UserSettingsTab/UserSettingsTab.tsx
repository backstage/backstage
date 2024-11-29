/*
 * Copyright 2020 The Backstage Authors
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
import React, { PropsWithChildren } from 'react';
import { attachComponentData } from '@backstage/core-plugin-api';
import {
  LAYOUT_ROUTE_DATA_KEY,
  SettingsLayout,
} from '../SettingsLayout/SettingsLayout';

/** @public @deprecated Use SettingsLayout.Route approach instead */
export const USER_SETTINGS_TAB_KEY = LAYOUT_ROUTE_DATA_KEY;

/** @public @deprecated Use SettingsLayoutRouteProps instead */
export type UserSettingsTabProps = PropsWithChildren<{
  /**
   * The path to the tab in the settings route
   * @example `/settings/advanced`
   */
  path: string;
  /** The title of the tab. It will also reflect in the document title when the tab is active */
  title: string;
}>;

/**
 * Renders a tab inside the settings page
 * @param props - Component props
 * @public
 * @deprecated Use SettingsLayout.Route instead
 */
export const UserSettingsTab = (props: UserSettingsTabProps) => (
  <SettingsLayout.Route path={props.path} title={props.title}>
    <>props.children</>
  </SettingsLayout.Route>
);

attachComponentData(UserSettingsTab, USER_SETTINGS_TAB_KEY, 'UserSettingsTab');
