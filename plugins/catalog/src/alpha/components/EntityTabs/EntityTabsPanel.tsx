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

import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

/** @public */
export type EntityTabsPanelClassKey = 'root' | 'stretch' | 'noPadding';

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      gridArea: 'pageContent',
      minWidth: 0,
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
      },
    },
    stretch: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
    noPadding: {
      padding: 0,
    },
  }),
  { name: 'EntityTabsPanel' },
);

type EntityTabsPanelProps = PropsWithChildren<{
  stretch?: boolean;
  noPadding?: boolean;
  className?: string;
}>;

export function EntityTabsPanel(props: EntityTabsPanelProps) {
  const { className, stretch, noPadding, children, ...restProps } = props;

  const classes = useStyles();
  return (
    <article
      {...restProps}
      className={classNames(classes.root, className, {
        [classes.stretch]: stretch,
        [classes.noPadding]: noPadding,
      })}
    >
      {children}
    </article>
  );
}
