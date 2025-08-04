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
import { useRef, useState, useEffect } from 'react';
import { RiArrowRightSLine, RiMore2Line, RiShapesLine } from '@remixicon/react';
import type { HeaderToolbarProps } from './types';
import { ButtonIcon } from '../ButtonIcon';
import { Menu } from '../Menu';
import { Text } from '../Text';
import { useNavigate, useHref } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * A component that renders a toolbar.
 *
 * @internal
 */
export const HeaderToolbar = (props: HeaderToolbarProps) => {
  const {
    icon,
    title,
    titleLink,
    menuItems,
    breadcrumbs,
    customActions,
    hasTabs,
  } = props;
  const { classNames } = useStyles('Header');
  let navigate = useNavigate();

  // Refs for collision detection
  const toolbarWrapperRef = useRef<HTMLDivElement>(null);
  const toolbarContentRef = useRef<HTMLDivElement>(null);
  const toolbarControlsRef = useRef<HTMLDivElement>(null);
  const breadcrumbsRef = useRef<HTMLDivElement>(null);

  // State for breadcrumb visibility
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(true);

  // Set up resize observer
  useEffect(() => {
    const wrapper = toolbarWrapperRef.current;
    if (!wrapper) return;

    const resizeObserver = new ResizeObserver(() => {
      const wrapper = toolbarWrapperRef.current;
      const content = toolbarContentRef.current;
      const options = toolbarControlsRef.current;

      if (!wrapper || !content) return;

      // Get dimensions
      const wrapperRect = wrapper.getBoundingClientRect();
      const wrapperWidth = wrapperRect.width;
      const wrapperPadding = 24; // 12px on each side (var(--bui-space-3))
      const availableWidth = wrapperWidth - wrapperPadding;

      // Calculate required width for content
      const contentRect = content.getBoundingClientRect();
      const contentWidth = contentRect?.width || 0;

      // Calculate options width (if exists)
      const optionsRect = options?.getBoundingClientRect();
      const optionsWidth = optionsRect?.width || 0;

      // Check if we need to hide breadcrumbs
      const shouldShowBreadcrumbs =
        contentWidth + optionsWidth + 32 <= availableWidth;

      // Only update state if the value actually changed to prevent flickering
      setShowBreadcrumbs(prev =>
        prev !== shouldShowBreadcrumbs ? shouldShowBreadcrumbs : prev,
      );
    });

    resizeObserver.observe(wrapper);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useGSAP(() => {
    gsap.to(breadcrumbsRef.current, {
      scrollTrigger: {
        start: '10% 10%',
        end: '20% 20%',
        scrub: true,
      },
      opacity: 1,
      duration: 1,
      ease: 'power2.inOut',
    });
  });

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
            {breadcrumbs && (
              <div
                ref={breadcrumbsRef}
                className={classNames.breadcrumbs}
                style={{
                  opacity: 0,
                  visibility: showBreadcrumbs ? 'visible' : 'hidden',
                }}
              >
                <RiArrowRightSLine
                  size={16}
                  className={classNames.breadcrumbSeparator}
                />
                {breadcrumbs.map((breadcrumb, index) => (
                  <div key={breadcrumb.label} className={classNames.breadcrumb}>
                    <Link
                      href={breadcrumb.href}
                      className={classNames.breadcrumbLink}
                      data-active={index === breadcrumbs.length - 1}
                    >
                      {breadcrumb.label}
                    </Link>
                    {index < breadcrumbs.length - 1 && (
                      <RiArrowRightSLine
                        size={16}
                        className={classNames.breadcrumbSeparator}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
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
