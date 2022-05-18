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

import React from 'react';
import TextTruncate from 'react-text-truncate';
import {
  Box,
  Chip,
  Divider,
  ListItem,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { Link } from '@backstage/core-components';
import { AdrDocument } from '@backstage/plugin-adr-common';

const useStyles = makeStyles({
  flexContainer: {
    flexWrap: 'wrap',
  },
  itemText: {
    width: '100%',
    wordBreak: 'break-all',
    marginBottom: '1rem',
  },
});

/**
 * A component to display a ADR search result
 * @public
 */
export const AdrSearchResultListItem = ({
  lineClamp = 5,
  result,
}: {
  lineClamp?: number;
  result: AdrDocument;
}) => {
  const classes = useStyles();

  return (
    <Link to={result.location}>
      <ListItem alignItems="flex-start" className={classes.flexContainer}>
        <ListItemText
          className={classes.itemText}
          primaryTypographyProps={{ variant: 'h6' }}
          primary={result.title}
          secondary={
            <TextTruncate
              line={lineClamp}
              truncateText="…"
              text={result.text}
              element="span"
            />
          }
        />
        <Box>
          {result.status && (
            <Chip label={`Status: ${result.status}`} size="small" />
          )}
          {result.date && <Chip label={`Date: ${result.date}`} size="small" />}
        </Box>
      </ListItem>
      <Divider component="li" />
    </Link>
  );
};
