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

import React, { PropsWithChildren, ReactNode } from 'react';
import {
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { Link } from '@backstage/core-components';
import { useAnalytics } from '@backstage/core-plugin-api';
import { ResultHighlight } from '@backstage/plugin-search-common';
import { HighlightedSearchResultText } from '@backstage/plugin-search-react';

const useStyles = makeStyles({
  flexContainer: {
    flexWrap: 'wrap',
  },
  itemText: {
    width: '100%',
    marginBottom: '1rem',
  },
});

/**
 * Props for {@link TechDocsSearchResultListItem}.
 *
 * @public
 */
export type TechDocsSearchResultListItemProps = {
  icon?: ReactNode;
  result: any;
  highlight?: ResultHighlight;
  rank?: number;
  lineClamp?: number;
  asListItem?: boolean;
  asLink?: boolean;
  title?: string;
};

/**
 * Component which renders documentation and related metadata.
 *
 * @public
 */
export const TechDocsSearchResultListItem = (
  props: TechDocsSearchResultListItemProps,
) => {
  const {
    result,
    highlight,
    rank,
    lineClamp = 5,
    asListItem = true,
    asLink = true,
    title,
    icon,
  } = props;
  const classes = useStyles();

  const analytics = useAnalytics();
  const handleClick = () => {
    analytics.captureEvent('discover', result.title, {
      attributes: { to: result.location },
      value: rank,
    });
  };

  const TextItem = () => {
    const resultTitle = highlight?.fields.title ? (
      <HighlightedSearchResultText
        text={highlight.fields.title}
        preTag={highlight.preTag}
        postTag={highlight.postTag}
      />
    ) : (
      result.title
    );

    const entityTitle = highlight?.fields.entityTitle ? (
      <HighlightedSearchResultText
        text={highlight.fields.entityTitle}
        preTag={highlight.preTag}
        postTag={highlight.postTag}
      />
    ) : (
      result.entityTitle
    );

    const resultName = highlight?.fields.name ? (
      <HighlightedSearchResultText
        text={highlight.fields.name}
        preTag={highlight.preTag}
        postTag={highlight.postTag}
      />
    ) : (
      result.name
    );

    return (
      <ListItemText
        className={classes.itemText}
        primaryTypographyProps={{ variant: 'h6' }}
        primary={
          title ? (
            title
          ) : (
            <>
              {resultTitle} | {entityTitle ?? resultName} docs
            </>
          )
        }
        secondary={
          <span
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
          </span>
        }
      />
    );
  };

  const LinkWrapper = ({ children }: PropsWithChildren<{}>) =>
    asLink ? (
      <Link noTrack to={result.location} onClick={handleClick}>
        {children}
      </Link>
    ) : (
      <>{children}</>
    );

  const ListItemWrapper = ({ children }: PropsWithChildren<{}>) =>
    asListItem ? (
      <>
        <ListItem alignItems="flex-start">
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <div className={classes.flexContainer}>{children}</div>
        </ListItem>
        <Divider component="li" />
      </>
    ) : (
      <>{children}</>
    );

  return (
    <LinkWrapper>
      <ListItemWrapper>
        <TextItem />
      </ListItemWrapper>
    </LinkWrapper>
  );
};
