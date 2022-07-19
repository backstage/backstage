/*
 * Copyright 2021 The Backstage Authors
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

import { Link } from '@backstage/core-components';
import {
  makeStyles,
  List,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import React from 'react';
import { useToolkit, Tool } from './Context';

const useStyles = makeStyles(theme => ({
  toolkit: {
    display: 'flex',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  tool: {
    margin: theme.spacing(0.5, 1),
  },
  label: {
    marginTop: theme.spacing(1),
    fontSize: '0.9em',
    lineHeight: '1.25',
    color: theme.palette.text.secondary,
  },
  icon: {
    width: '64px',
    height: '64px',
    borderRadius: '50px',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: theme.shadows[1],
    backgroundColor: theme.palette.background.default,
  },
}));

/**
 * Props for Toolkit content component {@link Content}.
 *
 * @public
 */
export type ToolkitContentProps = {
  tools: Tool[];
};

/**
 * A component to display a list of tools for the user.
 *
 * @public
 */
export const Content = (props: ToolkitContentProps) => {
  const classes = useStyles();
  const toolkit = useToolkit();
  const tools = toolkit?.tools ?? props.tools;

  return (
    <List className={classes.toolkit}>
      {tools.map((tool: Tool) => (
        <Link key={tool.url} to={tool.url} className={classes.tool}>
          <ListItemIcon className={classes.icon}>{tool.icon}</ListItemIcon>
          <ListItemText
            secondaryTypographyProps={{ className: classes.label }}
            secondary={tool.label}
          />
        </Link>
      ))}
    </List>
  );
};
