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

import React from 'react';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import { useSidebarPinState } from '@backstage/core-components';
import { SidebarItem } from './SidebarItem';

export function SidebarPinner() {
  const { isMobile, isPinned, toggleSidebarPinState } = useSidebarPinState();

  if (isMobile) {
    return null;
  }

  const icon = isPinned ? KeyboardArrowLeftIcon : KeyboardArrowRightIcon;
  const title = isPinned ? 'Unpin sidebar' : 'Pin sidebar';

  return (
    <SidebarItem icon={icon} title={title} onClick={toggleSidebarPinState} />
  );
}
