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

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { makeStyles, Theme, ListItem, ListItemText } from '@material-ui/core';

import { useProvider } from '../Context';

const useStyles = makeStyles<Theme, { depth: number }>(theme => ({
  listItem: {
    paddingLeft: ({ depth = 0 }) => theme.spacing(depth * 2),
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

type TocItemProps = {
  id: string;
  text: string;
  depth: number;
  selected: boolean;
  onClick: (id: string) => void;
};

export const TocItem = ({
  id,
  depth,
  text,
  selected = false,
  onClick = () => {},
}: TocItemProps) => {
  const navigate = useNavigate();
  const { path, entityRef } = useProvider();
  const classes = useStyles({ depth });

  const handleClick = useCallback(() => {
    const baseUrl = `/docs/${entityRef.namespace}/${entityRef.kind}/${entityRef.name}`;
    const pathname = baseUrl.concat(path ? `/${path}` : '');
    navigate(`${pathname}#${id}`);
    onClick(id);
  }, [id, path, entityRef, onClick, navigate]);

  return (
    <ListItem
      key={id}
      classes={{
        root: classes.listItem,
        selected: classes.listItemSelected,
      }}
      onClick={handleClick}
      selected={selected}
      disableRipple
      button
      dense
    >
      <ListItemText primary={text} className={classes.listItemText} />
    </ListItem>
  );
};
