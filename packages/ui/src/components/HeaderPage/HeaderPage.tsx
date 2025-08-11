/*
 * Copyright 2025 The Backstage Authors
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

import type { HeaderPageProps } from './types';
import { Menu } from '../Menu';
import { Text } from '../Text';
import { ButtonIcon } from '../ButtonIcon';
import { RiArrowRightSLine, RiMore2Line } from '@remixicon/react';
import { Tabs, TabList, Tab } from '../Tabs';
import { useStyles } from '../../hooks/useStyles';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '../Container';
import { Link } from '../Link';

gsap.registerPlugin(ScrollTrigger);

/**
 * A component that renders a header page.
 *
 * @public
 */
export const HeaderPage = (props: HeaderPageProps) => {
  const { title, menuItems, tabs, customActions, breadcrumbs } = props;
  const { classNames } = useStyles('HeaderPage');
  const stickyRef = useRef<HTMLDivElement>(null);
  const stickyContentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stickyRef.current,
        start: 'top top',
        end: '120px top',
        scrub: true,
      },
    });

    tl.to(stickyContentRef.current, {
      opacity: 1,
      ease: 'power2.inOut',
    }).to(
      stickyRef.current,
      {
        zIndex: 10,
        ease: 'none',
      },
      '<',
    );
  });

  const controls = (
    <div className={classNames.controls}>
      {customActions}
      {menuItems && (
        <Menu.Root>
          <Menu.Trigger
            render={props => (
              <ButtonIcon
                {...props}
                size="small"
                icon={<RiMore2Line />}
                variant="tertiary"
              />
            )}
          />
          <Menu.Portal>
            <Menu.Positioner sideOffset={4} align="end">
              <Menu.Popup>
                {menuItems.map(menuItem => (
                  <Menu.Item
                    key={menuItem.value}
                    onClick={() => menuItem.onClick?.()}
                  >
                    {menuItem.label}
                  </Menu.Item>
                ))}
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      )}
    </div>
  );

  return (
    <>
      <Container className={classNames.root}>
        <div className={classNames.content}>
          <Text variant="title-small" weight="bold" as="h2">
            {title}
          </Text>
          {controls}
        </div>
        {tabs && (
          <div className={classNames.tabsWrapper}>
            <Tabs>
              <TabList>
                {tabs.map(tab => (
                  <Tab
                    key={tab.id}
                    id={tab.id}
                    href={tab.href}
                    matchStrategy={tab.matchStrategy}
                  >
                    {tab.label}
                  </Tab>
                ))}
              </TabList>
            </Tabs>
          </div>
        )}
      </Container>
      <div className={classNames.sticky} ref={stickyRef}>
        <div className={classNames.stickyWrapper} ref={stickyContentRef}>
          <Container className={classNames.stickyContent}>
            {breadcrumbs ? (
              <div className={classNames.breadcrumbs}>
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
            ) : (
              <Text variant="body-medium" as="p">
                {title}
              </Text>
            )}
            {controls}
          </Container>
        </div>
      </div>
    </>
  );
};
