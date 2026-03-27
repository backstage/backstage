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

import { ReactNode } from 'react';
import { Badge, Link } from '@backstage/core-components';
import {
  IndexableDocument,
  ResultHighlight,
} from '@backstage/plugin-search-common';
import { HighlightedSearchResultText } from '@backstage/plugin-search-react';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/frontend-plugin-api';

/** @public */
export type CatalogSearchResultListItemClassKey =
  | 'item'
  | 'flexContainer'
  | 'itemText';

/**
 * Props for {@link CatalogSearchResultListItem}.
 *
 * @public
 */
export interface CatalogSearchResultListItemProps {
  icon?: ReactNode | ((result: IndexableDocument) => ReactNode);
  result?: IndexableDocument;
  highlight?: ResultHighlight;
  rank?: number;
  lineClamp?: number;
}

/** @public */
export function CatalogSearchResultListItem(
  props: CatalogSearchResultListItemProps,
) {
  const result = props.result as any;
  const highlight = props.highlight as ResultHighlight;

  const { t } = useTranslationRef(catalogTranslationRef);

  if (!result) return null;

  return (
    <div className="flex">
      {props.icon && (
        <div className="mr-4 flex items-center">
          {typeof props.icon === 'function' ? props.icon(result) : props.icon}
        </div>
      )}
      <div className="flex flex-wrap">
        <div className="w-full break-all mb-4">
          <div className="text-lg font-semibold">
            <Link noTrack to={result.location}>
              {highlight?.fields.title ? (
                <HighlightedSearchResultText
                  text={highlight.fields.title}
                  preTag={highlight.preTag}
                  postTag={highlight.postTag}
                />
              ) : (
                result.title
              )}
            </Link>
          </div>
          <span
            className="text-sm text-muted-foreground"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: props.lineClamp,
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
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {result.kind && (
            <Badge variant="secondary">
              {t('searchResultItem.kind')}: {result.kind}
            </Badge>
          )}
          {result.type && (
            <Badge variant="secondary">
              {t('searchResultItem.type')}: {result.type}
            </Badge>
          )}
          {result.lifecycle && (
            <Badge variant="secondary">
              {t('searchResultItem.lifecycle')}: {result.lifecycle}
            </Badge>
          )}
          {result.owner && (
            <Badge variant="secondary">
              {t('searchResultItem.owner')}: {result.owner}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
