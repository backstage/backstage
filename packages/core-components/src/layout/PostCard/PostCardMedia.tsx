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
import { darken, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles(
  theme => ({
    root: {
      backgroundColor: darken(theme.palette.background.paper, 0.05),
      overflow: 'hidden',
      height: '40%',
      // // This makes the action area not clickable by the PostCareActionArea
      position: ({ interactive }: { interactive: boolean }) =>
        interactive ? 'relative' : undefined,
      transition: theme.transitions.create('scale', {
        duration: theme.transitions.duration.short,
      }),
      '&:hover, &:has(a:focus)': {
        scale: ({ interactive }: { interactive: boolean }) =>
          interactive ? 1.05 : 1,
        opacity: ({ interactive }: { interactive: boolean }) =>
          interactive ? 0.9 : 1,
      },
      zIndex: ({ interactive }: { interactive: boolean }) =>
        interactive ? 1 : undefined,
      '& img': {
        objectFit: 'cover',
        width: '100%',
        height: '100%',
      },
    },
  }),
  { name: 'PostCardMedia' },
);

export type PostCardMediaProps = {
  children: React.ReactNode;
  interactive?: boolean;
};

export function PostCardMedia({
  interactive = false,
  children,
}: PostCardMediaProps) {
  const classes = useStyles({ interactive });
  return <CardMedia className={classes.root}>{children}</CardMedia>;
}
