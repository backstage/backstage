/*
 * Copyright 2020 Spotify AB
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
import classnames from 'classnames';
import { makeStyles, Link } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import { Link as RouterLink } from '../Link';

export type IconLinkVerticalProps = {
  icon?: React.ReactNode;
  href?: string;
  disabled?: boolean;
  label: string;
  action?: React.ReactNode;
};

const useIconStyles = makeStyles(theme => ({
  link: {
    display: 'grid',
    justifyItems: 'center',
    gridGap: 4,
    textAlign: 'center',
  },
  disabled: {
    color: 'gray',
  },
  label: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    fontWeight: 600,
    letterSpacing: 1.2,
  },
  linkStyle: {
    color: theme.palette.secondary.main,
  },
}));

export function IconLinkVertical({
  icon = <LinkIcon />,
  href = '#',
  disabled = false,
  action,
  ...props
}: IconLinkVerticalProps) {
  const classes = useIconStyles();

  if (disabled) {
    return (
      <Link
        className={classnames(classes.link, classes.disabled)}
        underline="none"
        {...props}
      >
        {icon}
        <span className={classes.label}>{props.label}</span>
      </Link>
    );
  }

  if (action) {
    return (
      <Link className={classnames(classes.link, classes.linkStyle)} {...props}>
        {icon}
        {action}
      </Link>
    );
  }

  return (
    <Link className={classes.link} to={href} component={RouterLink} {...props}>
      {icon}
      <span className={classes.label}>{props.label}</span>
    </Link>
  );
}
