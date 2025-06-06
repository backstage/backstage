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

import { ReactNode } from 'react';
import { AnalyticsContext } from '@backstage/core-plugin-api';
import {
  ResultHighlight,
  SearchDocument,
} from '@backstage/plugin-search-common';
import { HighlightedSearchResultText } from '../HighlightedSearchResultText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import { Text } from '@backstage/canon';
import { Link } from '@backstage/core-components';

/**
 * Props for {@link DefaultResultListItem}
 *
 * @public
 */
export type DefaultResultListItemProps = {
  icon?: ReactNode;
  secondaryAction?: ReactNode;
  result?: SearchDocument;
  highlight?: ResultHighlight;
  rank?: number;
  lineClamp?: number;
  toggleModal?: () => void;
};

/**
 * A default result list item.
 *
 * @public
 */
export const DefaultResultListItemComponent = ({
  result,
  highlight,
  icon,
  secondaryAction,
  lineClamp = 5,
}: DefaultResultListItemProps) => {
  if (!result) return null;

  return (
    <>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText
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
          <Text variant="body" color="secondary">
            {highlight?.fields.text ? (
              <HighlightedSearchResultText
                text={highlight.fields.text}
                preTag={highlight.preTag}
                postTag={highlight.postTag}
              />
            ) : (
              result.text
            )}
          </Text>
        }
      />
      {secondaryAction && <Box alignItems="flex-end">{secondaryAction}</Box>}
    </>
  );
};

/**
 * @public
 */
const HigherOrderDefaultResultListItem = (
  props: DefaultResultListItemProps,
) => {
  return (
    <AnalyticsContext
      attributes={{
        pluginId: 'search',
        extension: 'DefaultResultListItem',
      }}
    >
      <DefaultResultListItemComponent {...props} />
    </AnalyticsContext>
  );
};

export { HigherOrderDefaultResultListItem as DefaultResultListItem };
