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

import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { ReactNode } from 'react';

const useStyles = makeStyles({
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  indented: {
    paddingLeft: 'var(--bui-space-4)',
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: 'var(--bui-space-1)',
    paddingLeft: 'var(--bui-space-4)',
    fontFamily: 'monospace',
    fontSize: 'var(--bui-font-size-3)',
    '&:first-child': {
      marginTop: 0,
    },
  },
});

export function ListSection(props: {
  children: ReactNode;
  indent?: boolean;
  className?: string;
  'aria-label'?: string;
}) {
  const classes = useStyles();
  return (
    <ul
      className={classNames(
        classes.list,
        props.indent && classes.indented,
        props.className,
      )}
      aria-label={props['aria-label']}
    >
      {props.children}
    </ul>
  );
}

/**
 * A dense monospace list item.
 */
export function ListItemRow(props: { children: ReactNode }) {
  const classes = useStyles();
  return <li className={classes.listItem}>{props.children}</li>;
}
