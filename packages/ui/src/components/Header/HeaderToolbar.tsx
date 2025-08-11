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

import { Link, RouterProvider } from 'react-aria-components';
import { useStyles } from '../../hooks/useStyles';
import { useRef } from 'react';
import { RiMore2Line, RiShapesLine } from '@remixicon/react';
import type { HeaderToolbarProps } from './types';
import { ButtonIcon } from '../ButtonIcon';
import { Menu } from '../Menu';
import { Text } from '../Text';
import { useNavigate, useHref } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * A component that renders a toolbar.
 *
 * @internal
 */
export const HeaderToolbar = (props: HeaderToolbarProps) => {
  const { icon, title, titleLink, menuItems, customActions, hasTabs } = props;
  const { classNames } = useStyles('Header');
  let navigate = useNavigate();

  // Refs for collision detection
  const toolbarWrapperRef = useRef<HTMLDivElement>(null);
  const toolbarContentRef = useRef<HTMLDivElement>(null);
  const toolbarControlsRef = useRef<HTMLDivElement>(null);

  const titleContent = (
    <>
      <div className={classNames.toolbarIcon}>{icon || <RiShapesLine />}</div>
      <Text variant="body-medium">{title || 'Your plugin'}</Text>
    </>
  );

  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <div className={classNames.toolbar} data-has-tabs={hasTabs}>
        <div className={classNames.toolbarWrapper} ref={toolbarWrapperRef}>
          <div className={classNames.toolbarContent} ref={toolbarContentRef}>
            <Text as="h1" variant="body-medium">
              {titleLink ? (
                <Link className={classNames.toolbarName} href={titleLink}>
                  {titleContent}
                </Link>
              ) : (
                <div className={classNames.toolbarName}>{titleContent}</div>
              )}
            </Text>
          </div>
          <div className={classNames.toolbarControls} ref={toolbarControlsRef}>
            {customActions}
            {menuItems && (
              <Menu.Root>
                <Menu.Trigger
                  render={props => (
                    <ButtonIcon
                      size="small"
                      icon={<RiMore2Line />}
                      variant="tertiary"
                      {...props}
                    />
                  )}
                />
                <Menu.Portal>
                  <Menu.Positioner sideOffset={4} align="end">
                    <Menu.Popup>
                      {menuItems.map(option => (
                        <Menu.Item
                          key={option.value}
                          onClick={() => option.onClick?.()}
                        >
                          {option.label}
                        </Menu.Item>
                      ))}
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            )}
          </div>
        </div>
      </div>
    </RouterProvider>
  );
};
