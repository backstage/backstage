/*
 * Copyright 2024 The Backstage Authors
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
import Card from '@material-ui/core/Card';
import { makeStyles, Theme } from '@material-ui/core/styles';

import React from 'react';
import { PostCardActions } from './PostCardActions';
import { PostCardDescription } from './PostCardDescription';
import { PostCardMedia } from './PostCardMedia';
import { PostCardTitle } from './PostCardTitle';

const useStyles = makeStyles<Theme, { size?: string }>(
  theme => ({
    root: {
      position: 'relative',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      borderRadius: theme.shape.borderRadius,
      height: ({ size }) => {
        switch (size) {
          case 'large':
            return '450px';
          case 'small':
            return '200px';
          case 'medium':
          default:
            return '350px';
        }
      },
      '&:hover, &:focus-within': {
        boxShadow: `0 0 0 0.25rem ${theme.palette.primary.main}`,
      },
    },
  }),
  { name: 'PostCard' },
);

export type PostCardProps = {
  children?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
};

export function PostCard({ children, size }: PostCardProps) {
  const classes = useStyles({ size });
  return (
    <Card className={classes.root} data-testid="hack-card">
      <>{children}</>
    </Card>
  );
}

PostCard.Title = PostCardTitle;
PostCard.Media = PostCardMedia;
PostCard.Actions = PostCardActions;
PostCard.Description = PostCardDescription;
