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
import _unescape from 'lodash/unescape';
import { Link } from '@backstage/core-components';
import {
  Divider,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Chip,
} from '@material-ui/core';
import { useAnalytics } from '@backstage/core-plugin-api';
import { ResultHighlight } from '@backstage/plugin-search-common';
import { HighlightedSearchResultText } from '@backstage/plugin-search-react';

/**
 * Props for {@link StackOverflowSearchResultListItem}
 *
 * @public
 */
export type StackOverflowSearchResultListItemProps = {
  result?: any; // TODO(emmaindal): type to StackOverflowDocument.
  icon?: React.ReactNode;
  rank?: number;
  highlight?: ResultHighlight;
};

export const StackOverflowSearchResultListItem = (
  props: StackOverflowSearchResultListItemProps,
) => {
  const { result, highlight } = props;
  const analytics = useAnalytics();

  const handleClick = () => {
    analytics.captureEvent('discover', result.title, {
      attributes: { to: result.location },
      value: props.rank,
    });
  };

  if (!result) {
    return null;
  }

  return (
    <>
      <ListItem alignItems="center">
        {props.icon && <ListItemIcon>{props.icon}</ListItemIcon>}
        <Box flexWrap="wrap">
          <ListItemText
            primaryTypographyProps={{ variant: 'h6' }}
            primary={
              <Link to={result.location} noTrack onClick={handleClick}>
                {highlight?.fields?.title ? (
                  <HighlightedSearchResultText
                    text={highlight.fields.title}
                    preTag={highlight.preTag}
                    postTag={highlight.postTag}
                  />
                ) : (
                  _unescape(result.title)
                )}
              </Link>
            }
            secondary={
              highlight?.fields?.text ? (
                <>
                  Author:{' '}
                  <HighlightedSearchResultText
                    text={highlight.fields.text}
                    preTag={highlight.preTag}
                    postTag={highlight.postTag}
                  />
                </>
              ) : (
                `Author: ${result.text}`
              )
            }
          />
          <Chip label={`Answer(s): ${result.answers}`} size="small" />
          {result.tags &&
            result.tags.map((tag: string) => (
              <Chip key={tag} label={`Tag: ${tag}`} size="small" />
            ))}
        </Box>
      </ListItem>
      <Divider />
    </>
  );
};
