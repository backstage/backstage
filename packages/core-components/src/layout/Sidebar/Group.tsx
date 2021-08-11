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

import { BottomNavigationAction } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';

/**
 * If the page is mobile it should be BottomNavigationAction - otherwise just a fragment
 * Links to page, which will be displayed
 * - If 'to' Prop is not defined it will render a Menu page out of the children (if children given)
 */
export const SidebarGroup = ({ children }: React.PropsWithChildren<{}>) => {
  return <BottomNavigationAction label="Recents" icon={<MenuIcon />} />;
};
