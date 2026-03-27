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
    <li className="flex items-start py-3 px-4 border-b border-border hover:bg-muted/50 transition-colors">
      {icon && (
        <div className="mr-4 mt-1 flex-shrink-0 text-muted-foreground">
          {icon}
        </div>
      )}
      <div className="flex flex-col min-w-0 flex-1">
        <Link
          noTrack
          to={result.location}
          className="text-sm font-medium truncate"
        >
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
        <p
          className="text-xs text-muted-foreground"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: lineClamp,
            overflow: 'hidden',
          }}
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
        </p>
      </div>
      {secondaryAction && (
        <div className="ml-auto flex-shrink-0">{secondaryAction}</div>
      )}
    </li>
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
