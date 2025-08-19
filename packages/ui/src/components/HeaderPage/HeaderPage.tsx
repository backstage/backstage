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
import { Text } from '../Text';
import { RiArrowRightSLine } from '@remixicon/react';
import { Tabs, TabList, Tab } from '../Tabs';
import { useStyles } from '../../hooks/useStyles';
import { Container } from '../Container';
import { Link } from '../Link';
import { Fragment } from 'react/jsx-runtime';

/**
 * A component that renders a header page.
 *
 * @public
 */
export const HeaderPage = (props: HeaderPageProps) => {
  const { title, tabs, customActions, breadcrumbs } = props;
  const { classNames } = useStyles('HeaderPage');

  return (
    <Container className={classNames.root}>
      <div className={classNames.content}>
        <div className={classNames.breadcrumbs}>
          {breadcrumbs &&
            breadcrumbs.map(breadcrumb => (
              <Fragment key={breadcrumb.label}>
                <Link
                  href={breadcrumb.href}
                  variant="title-small"
                  weight="bold"
                  color="secondary"
                  truncate
                  style={{ maxWidth: '240px' }}
                >
                  {breadcrumb.label}
                </Link>
                <RiArrowRightSLine size={16} color="var(--bui-fg-secondary)" />
              </Fragment>
            ))}
          <Text variant="title-small" weight="bold" as="h2">
            {title}
          </Text>
        </div>
        <div className={classNames.controls}>{customActions}</div>
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
  );
};
