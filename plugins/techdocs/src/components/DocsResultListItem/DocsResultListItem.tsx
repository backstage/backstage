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

import React, { PropsWithChildren } from 'react';
import { Divider, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import { Link } from '@backstage/core-components';
import TextTruncate from 'react-text-truncate';

const useStyles = makeStyles({
  flexContainer: {
    flexWrap: 'wrap',
  },
  itemText: {
    width: '100%',
    marginBottom: '1rem',
  },
});

export const DocsResultListItem = ({
  result,
  lineClamp = 5,
  asListItem = true,
  asLink = true,
  title,
}: {
  result: any;
  lineClamp?: number;
  asListItem?: boolean;
  asLink?: boolean;
  title?: string;
}) => {
  const classes = useStyles();
  const TextItem = () => (
    <ListItemText
      className={classes.itemText}
      primaryTypographyProps={{ variant: 'h6' }}
      primary={
        title
          ? title
          : `${result.title} | ${result.entityTitle ?? result.name} docs`
      }
      secondary={
        <TextTruncate
          line={lineClamp}
          truncateText="…"
          text={result.text}
          element="span"
        />
      }
    />
  );

  const LinkWrapper = ({ children }: PropsWithChildren<{}>) =>
    asLink ? <Link to={result.location}>{children}</Link> : <>{children}</>;

  const ListItemWrapper = ({ children }: PropsWithChildren<{}>) =>
    asListItem ? (
      <>
        <ListItem alignItems="flex-start" className={classes.flexContainer}>
          {children}
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
