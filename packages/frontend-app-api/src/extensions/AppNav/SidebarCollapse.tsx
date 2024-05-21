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

import React, { ReactNode, useCallback, useState } from 'react';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {
  SidebarScrollWrapper,
  useSidebarPinState,
} from '@backstage/core-components';
import { IconComponent } from '@backstage/frontend-plugin-api';
import { SidebarItem } from './SidebarItem';

export function SidebarCollapse(props: {
  icon: IconComponent;
  title: string;
  children: ReactNode;
  open?: true;
}) {
  const { icon, title, open: initialOpen = false, children } = props;
  const [open, setOpen] = useState(initialOpen);
  const { isMobile } = useSidebarPinState();

  const handleClick = useCallback(
    () => setOpen(prevOpen => !prevOpen),
    [setOpen],
  );

  return isMobile ? (
    children
  ) : (
    <SidebarScrollWrapper>
      <SidebarItem icon={icon} title={title} onClick={handleClick}>
        {open ? (
          <ExpandLess fontSize="small" />
        ) : (
          <ExpandMore fontSize="small" />
        )}
      </SidebarItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </SidebarScrollWrapper>
  );
}
