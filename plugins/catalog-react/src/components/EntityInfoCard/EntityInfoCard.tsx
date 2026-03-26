/*
 * Copyright 2026 The Backstage Authors
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

import { ReactNode } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Flex,
} from '@backstage/ui';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles({
  root: {
    height: '100%',
  },
  title: {
    minWidth: 0,
    overflow: 'hidden',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

/** @public */
export interface EntityInfoCardProps {
  title?: ReactNode;
  headerActions?: ReactNode;
  footerActions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** @public */
export function EntityInfoCard(props: EntityInfoCardProps) {
  const { title, headerActions, footerActions, children, className } = props;
  const classes = useStyles();

  return (
    <Card className={classNames(classes.root, className)}>
      {title && (
        <CardHeader>
          <Flex justify="between" align="center">
            <Text
              as="h3"
              variant="title-x-small"
              weight="bold"
              className={classes.title}
            >
              {title}
            </Text>
            {headerActions && (
              <Flex align="center" gap="1">
                {headerActions}
              </Flex>
            )}
          </Flex>
        </CardHeader>
      )}
      <CardBody>{children}</CardBody>
      {footerActions && (
        <CardFooter className={classes.footer}>{footerActions}</CardFooter>
      )}
    </Card>
  );
}
