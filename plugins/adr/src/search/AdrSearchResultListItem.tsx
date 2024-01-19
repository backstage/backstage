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

import React, { ReactNode } from 'react';
import {
  Box,
  Chip,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { parseEntityRef } from '@backstage/catalog-model';
import { Link } from '@backstage/core-components';
import { AdrDocument } from '@backstage/plugin-adr-common';
import { humanizeEntityRef } from '@backstage/plugin-catalog-react';
import { ResultHighlight } from '@backstage/plugin-search-common';
import { HighlightedSearchResultText } from '@backstage/plugin-search-react';

const useStyles = makeStyles({
  item: {
    display: 'flex',
  },
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
 * @public
 */
export type AdrSearchResultListItemProps = {
  lineClamp?: number;
  highlight?: ResultHighlight;
  icon?: ReactNode;
  rank?: number;
  result?: AdrDocument;
};

/**
 * A component to display an ADR search result.
 * @public
 */
export function AdrSearchResultListItem(props: AdrSearchResultListItemProps) {
  const { lineClamp = 5, highlight, icon, result } = props;
  const classes = useStyles();

  if (!result) return null;

  return (
    <div className={classes.item}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <div className={classes.flexContainer}>
        <ListItemText
          className={classes.itemText}
          primaryTypographyProps={{ variant: 'h6' }}
          primary={
            <Link noTrack to={result.location}>
              {highlight?.fields.title ? (
                <HighlightedSearchResultText
                  text={highlight?.fields.title || ''}
                  preTag={highlight?.preTag || ''}
                  postTag={highlight?.postTag || ''}
                />
              ) : (
                result.title
              )}
            </Link>
          }
          secondary={
            <Typography
              component="span"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: lineClamp,
                overflow: 'hidden',
              }}
              color="textSecondary"
              variant="body2"
            >
              {highlight?.fields.text ? (
                <HighlightedSearchResultText
                  text={highlight.fields.text}
                  preTag={highlight.preTag}
                  postTag={highlight.postTag}
                />
              ) : (
                result.text
              )}
            </Typography>
          }
        />
        <Box>
          <Chip
            label={`Entity: ${
              result.entityTitle ??
              humanizeEntityRef(parseEntityRef(result.entityRef))
            }`}
            size="small"
          />
          {result.status && (
            <Chip label={`Status: ${result.status}`} size="small" />
          )}
          {result.date && <Chip label={`Date: ${result.date}`} size="small" />}
        </Box>
      </div>
    </div>
  );
}
