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

import React, {
  PropsWithChildren,
  MouseEvent,
  useState,
  useCallback,
} from 'react';
import {
  useRouteRefResolver,
  IconComponent,
  createNavItemExtension,
} from '@backstage/frontend-plugin-api';
import {
  SidebarItem as SidebarBaseItem,
  SidebarSubmenuItem,
} from '@backstage/core-components';

type SidebarItemProps = PropsWithChildren<
  | (typeof createNavItemExtension.targetDataRef)['T']
  | {
      title: string;
      subtitle?: string;
      icon: IconComponent;
      onClick?: (event: MouseEvent) => void;
    }
>;

export function SidebarItem(props: SidebarItemProps) {
  const { icon: Icon, title, subtitle, children } = props;
  const [active, setActive] = useState(false);
  const resolveRouteRef = useRouteRefResolver();

  const type = 'type' in props ? props.type : undefined;
  const to = 'to' in props ? props.to : undefined;
  const path = typeof to === 'string' ? to : resolveRouteRef(to)?.();
  const onClick = 'onClick' in props ? props.onClick : undefined;
  const SecondaryAction =
    'secondaryAction' in props ? props.secondaryAction : undefined;

  const handleClick = useCallback(
    (event: MouseEvent) => {
      onClick?.(event);
      setActive(prevOpen => !prevOpen);
    },
    [onClick, setActive],
  );

  const handleToggle = useCallback(
    () => setActive(prevActive => !prevActive),
    [setActive],
  );

  // Optional external route
  if (to !== undefined && !path) {
    return null;
  }

  return (
    <>
      {type === 'drawer' ? (
        <SidebarSubmenuItem
          to={path}
          icon={Icon}
          title={title}
          subtitle={subtitle}
          exact
        />
      ) : (
        <SidebarBaseItem
          to={path}
          icon={Icon}
          text={title}
          secondaryText={subtitle}
          onClick={handleClick}
        >
          {children}
        </SidebarBaseItem>
      )}
      {SecondaryAction ? (
        <SecondaryAction active={active} toggle={handleToggle} />
      ) : null}
    </>
  );
}
