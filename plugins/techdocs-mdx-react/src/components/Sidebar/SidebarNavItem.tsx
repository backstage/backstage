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

import React, {
  Fragment,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';

import {
  makeStyles,
  Theme,
  Hidden,
  Collapse,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListIcon from '@material-ui/icons/List';

import { TechDocsNav } from '../types';
import { useProvider } from '../Context';

import { SidebarNav } from './SidebarNav';
import { useTechDocsRoute } from '../hooks';

const useStyles = makeStyles<Theme, { depth: number }>(theme => ({
  listItem: {
    whiteSpace: 'pre-wrap',
    paddingLeft: ({ depth = 0 }) => theme.spacing((depth + 1) * 2),
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
    },
  },
  listItemSelected: {
    '&.Mui-selected': {
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
    },
    '&.Mui-selected:hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
    },
  },
  listItemText: {
    whiteSpace: 'pre-wrap',
  },
}));

type SidebarNavItemProps = {
  item: TechDocsNav[0];
  depth: number;
  onShow?: () => void;
};

const isSelected = (id: string, path: string) => {
  if (id === 'index.md') {
    return !path;
  }
  return `${path}.md` === id;
};

const hasToc = (headings: { depth: number }[] = []) => {
  return headings.filter(heading => heading.depth > 1).length > 0;
};

const getPaths = (items: TechDocsNav, paths: string[] = []): string[] => {
  for (const item of items) {
    const [value] = Object.values(item);
    if (typeof value === 'string') {
      paths.push(value.replace('.md', ''));
    } else {
      getPaths(value, paths);
    }
  }
  return paths;
};

export const SidebarNavItem = ({
  item,
  depth,
  onShow = () => {},
}: SidebarNavItemProps) => {
  const classes = useStyles({ depth });
  const navigate = useNavigate();
  const { path, code } = useProvider();
  const techdocsRoute = useTechDocsRoute();

  const [[key, value]] = useMemo(() => Object.entries(item), [item]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof value === 'string') return;
    const paths = getPaths(value);
    setOpen(paths.includes(path || 'index'));
  }, [path, value]);

  const handleClick = useCallback(
    () => setOpen(prevOpen => !prevOpen),
    [setOpen],
  );

  const handleSelect = useCallback(
    (id: string) => () => {
      const pathname = id === 'index.md' ? '' : `/${id.replace('.md', '')}`;
      navigate(techdocsRoute(pathname));
    },
    [navigate, techdocsRoute],
  );

  if (typeof value === 'string') {
    return (
      <ListItem
        key={key}
        classes={{
          root: classes.listItem,
          selected: classes.listItemSelected,
        }}
        selected={isSelected(value, path)}
        onClick={handleSelect(value)}
        disableRipple
        button
        dense
      >
        <ListItemText primary={key} className={classes.listItemText} />
        <Hidden mdUp>
          {isSelected(value, path) && hasToc(code.data.headings) && (
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                size="small"
                aria-label="toc"
                onClick={event => {
                  event.stopPropagation();
                  onShow();
                }}
              >
                <ListIcon />
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </Hidden>
      </ListItem>
    );
  }

  return (
    <Fragment key={key}>
      <ListItem
        classes={{
          root: classes.listItem,
        }}
        onClick={handleClick}
        disableRipple
        button
        dense
      >
        <ListItemText primary={key} className={classes.listItemText} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <SidebarNav items={value} depth={depth + 1} onShow={onShow} />
      </Collapse>
    </Fragment>
  );
};
