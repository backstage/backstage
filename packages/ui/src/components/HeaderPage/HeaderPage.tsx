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
import { useDefinition } from '../../hooks/useDefinition';
import { HeaderPageDefinition } from './definition';
import { Container } from '../Container';
import { Link } from '../Link';
import { Fragment } from 'react/jsx-runtime';

/**
 * A component that renders a header page.
 *
 * @public
 */
export const HeaderPage = (props: HeaderPageProps) => {
  const { ownProps } = useDefinition(HeaderPageDefinition, props);
  const { classes, title, tabs, customActions, breadcrumbs } = ownProps;

  return (
    <Container className={classes.root}>
      <div className={classes.content}>
        <div className={classes.breadcrumbs}>
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
                  standalone
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
        <div className={classes.controls}>{customActions}</div>
      </div>
      {tabs && (
        <div className={classes.tabsWrapper}>
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
