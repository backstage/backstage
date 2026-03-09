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

import { forwardRef } from 'react';
import { useDefinition } from '../../hooks/useDefinition';
import { StatCardDefinition } from './definition';
import type { StatCardProps } from './types';
import { Box } from '../Box/Box';
import { Text } from '../Text/Text';
import { Flex } from '../Flex/Flex';
import { Link } from '../Link';

/**
 * StatCard component for displaying metrics and key performance indicators.
 *
 * @public
 */
export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (props, ref) => {
    const { ownProps, restProps, dataAttributes } = useDefinition(
      StatCardDefinition,
      props,
    );
    const {
      classes,
      label,
      value,
      trend,
      status,
      icon,
      description,
      onPress,
      href,
    } = ownProps;

    const hasHref = !!href;
    const hasOnPress = !!onPress;

    if (process.env.NODE_ENV !== 'production' && hasHref && hasOnPress) {
      // eslint-disable-next-line no-console
      console.warn(
        'StatCard: `href` and `onPress` are mutually exclusive. `href` will take precedence and `onPress` will be ignored.',
      );
    }

    const isInteractive = hasHref || hasOnPress;

    const content = (
      <Box
        as={isInteractive && !hasHref ? 'button' : 'div'}
        bg="neutral"
        ref={ref}
        className={classes.root}
        data-interactive={isInteractive || undefined}
        onClick={hasHref ? undefined : onPress}
        type={isInteractive && !hasHref ? 'button' : undefined}
        {...dataAttributes}
        {...restProps}
      >
        <Flex direction="column" gap="2">
          <Flex align="center" gap="2">
            {icon && <Box className={classes.icon}>{icon}</Box>}
            <Text
              variant="body-small"
              color="secondary"
              className={classes.label}
            >
              {label}
            </Text>
          </Flex>

          <Flex align="baseline" gap="2">
            <Text variant="title-large" weight="bold" className={classes.value}>
              {value}
            </Text>
            {trend && (
              <Text
                variant="body-small"
                className={`${classes.trend} bui-StatCard-trend--${status}`}
              >
                {trend}
              </Text>
            )}
          </Flex>

          {description && (
            <Text
              variant="body-small"
              color="secondary"
              className={classes.description}
            >
              {description}
            </Text>
          )}
        </Flex>
      </Box>
    );

    if (href) {
      return (
        <Link href={href} className={classes.link}>
          {content}
        </Link>
      );
    }

    return content;
  },
);

StatCard.displayName = 'StatCard';
