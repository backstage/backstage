/*
 * Copyright 2022 The Backstage Authors
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

import { BackstageTheme } from '@backstage/theme';
import Button, { ButtonProps } from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';

/**
 * Properties for {@link ResponsiveIconButton}
 *
 * @public
 */
export type ResponsiveIconButtonProps = {
  title: string;
  icon: JSX.Element;
} & Partial<Pick<LinkProps, 'to'>> &
  Partial<Pick<ButtonProps, 'color' | 'variant'>>;

/**
 * Responsive button that displays an icon at small screen sizes, or the title on larger screens.
 *
 * @public
 */
export function ResponsiveIconButton(props: ResponsiveIconButtonProps) {
  const { title, to, icon, ...rest } = props;
  const isXSScreen = useMediaQuery<BackstageTheme>(theme =>
    theme.breakpoints.down('xs'),
  );

  if (!to) {
    return null;
  }

  return isXSScreen ? (
    <IconButton
      component={RouterLink}
      title={title}
      size="small"
      to={to}
      {...rest}
    >
      {icon}
    </IconButton>
  ) : (
    <Button component={RouterLink} to={to} {...rest}>
      {title}
    </Button>
  );
}
