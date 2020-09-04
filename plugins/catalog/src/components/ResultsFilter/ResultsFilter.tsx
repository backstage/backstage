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

import {
  Button,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { useCallback, useContext, useState } from 'react';
import { filterGroupsContext } from '../../filter/context';

const useStyles = makeStyles<Theme>(theme => ({
  filterBox: {
    display: 'flex',
    margin: theme.spacing(2, 0, 0, 0),
  },
  filterBoxTitle: {
    margin: theme.spacing(1, 0, 0, 1),
    fontWeight: 'bold',
    flex: 1,
  },
  title: {
    margin: theme.spacing(1, 0, 0, 1),
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkbox: {
    padding: theme.spacing(0, 1, 0, 1),
  },
}));

type Props = {
  availableTags: string[];
};

/**
 * The additional results filter in the sidebar.
 */
export const ResultsFilter = ({ availableTags }: Props) => {
  const classes = useStyles();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const context = useContext(filterGroupsContext);
  if (!context) {
    throw new Error(`Must be used inside an EntityFilterGroupsProvider`);
  }
  const setSelectedTagsFilter = context?.setSelectedTags;

  const updateSelectedTags = useCallback(
    (tags: string[]) => {
      setSelectedTags(tags);
      setSelectedTagsFilter(tags);
    },
    [setSelectedTags, setSelectedTagsFilter],
  );

  return (
    <>
      <div className={classes.filterBox}>
        <Typography variant="subtitle2" className={classes.filterBoxTitle}>
          Refine Results
        </Typography>{' '}
        <Button onClick={() => updateSelectedTags([])}>Clear</Button>
      </div>
      <Divider />
      <Typography variant="subtitle2" className={classes.title}>
        Tags
      </Typography>
      <List disablePadding dense>
        {availableTags.map(t => {
          const labelId = `checkbox-list-label-${t}`;
          return (
            <ListItem
              key={t}
              dense
              button
              onClick={() =>
                updateSelectedTags(
                  selectedTags.includes(t)
                    ? selectedTags.filter(s => s !== t)
                    : [...selectedTags, t],
                )
              }
            >
              <Checkbox
                edge="start"
                color="primary"
                checked={selectedTags.includes(t)}
                tabIndex={-1}
                disableRipple
                className={classes.checkbox}
                inputProps={{ 'aria-labelledby': labelId }}
              />
              <ListItemText id={labelId} primary={t} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
