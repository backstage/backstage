/*
 * Copyright 2020 The Backstage Authors
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
import React from 'react';
import { makeStyles } from 'tss-react/mui';
import LinkIcon from '@mui/icons-material/Link';
import { Link } from '../Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export type IconLinkVerticalProps = {
  color?: 'primary' | 'secondary';
  disabled?: boolean;
  href?: string;
  icon?: React.ReactNode;
  label: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  title?: string;
};

/** @public */
export type IconLinkVerticalClassKey =
  | 'link'
  | 'disabled'
  | 'primary'
  | 'secondary'
  | 'label';

const useIconStyles = makeStyles({ name: 'BackstageIconLinkVertical' })(
  theme => ({
    link: {
      display: 'grid',
      justifyItems: 'center',
      gridGap: 4,
      textAlign: 'center',
    },
    disabled: {
      color: theme.palette.text.secondary,
      cursor: 'default',
    },
    primary: {
      color: theme.palette.primary.main,
    },
    secondary: {
      color: theme.palette.secondary.main,
    },
    label: {
      textTransform: 'uppercase',
      fontWeight: theme.typography.fontWeightBold,
      letterSpacing: 1.2,
    },
  }),
);

/** @public */
export function IconLinkVertical({
  color = 'primary',
  disabled = false,
  href = '#',
  icon = <LinkIcon />,
  label,
  onClick,
  title,
}: IconLinkVerticalProps) {
  const { classes, cx } = useIconStyles();

  if (disabled) {
    return (
      <Box title={title} className={cx(classes.link, classes.disabled)}>
        {icon}
        <Typography
          variant="caption"
          component="span"
          className={classes.label}
        >
          {label}
        </Typography>
      </Box>
    );
  }

  return (
    <Link
      title={title}
      className={cx(classes.link, classes[color])}
      to={href}
      onClick={onClick}
    >
      {icon}
      <Typography variant="caption" component="span" className={classes.label}>
        {label}
      </Typography>
    </Link>
  );
}
