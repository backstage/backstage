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

import React, { useState, useCallback, useEffect } from 'react';

import { makeStyles, List, ListSubheader } from '@material-ui/core';

import { Sticky } from '../Sticky';
import { useProvider } from '../Context';

import { TocItem } from './TocItem';

const useStyles = makeStyles(theme => ({
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  listSubheader: {
    lineHeight: '1.43',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
}));

type Heading = { id: string; text: string; depth: number };

export const Toc = () => {
  const classes = useStyles();
  const {
    code: { data },
  } = useProvider();
  const [selected, setSelected] = useState(
    window.location.hash.replace('#', ''),
  );

  useEffect(() => {
    if (!selected) return;
    const heading = document.getElementById(selected);
    heading?.scrollIntoView({ behavior: 'smooth' });
  }, [selected]);

  const handleClick = useCallback(
    (id: string) => {
      setSelected(id);
    },
    [setSelected],
  );

  const headings = data?.headings?.filter(({ depth }: Heading) => depth > 1);

  if (!headings?.length) {
    return null;
  }

  return (
    <Sticky>
      <List
        aria-labelledby="techdocs-toc"
        subheader={
          <ListSubheader
            className={classes.listSubheader}
            color="inherit"
            component="div"
            id="techdocs-toc"
            disableSticky
          >
            Table of contents
          </ListSubheader>
        }
        dense
      >
        {headings.map(({ id, text, depth }: Heading) => (
          <TocItem
            key={id}
            id={id}
            text={text}
            depth={depth - 1}
            selected={id === selected}
            onClick={handleClick}
          />
        ))}
      </List>
    </Sticky>
  );
};
