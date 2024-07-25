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
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { truncateLinesWithHeight } from './truncateLinesWithHeight';
import CardContent from '@material-ui/core/CardContent';

const initStyle = (lines: number) =>
  makeStyles(
    theme => ({
      root: {
        flexGrow: 1,
      },
      content: {
        ...truncateLinesWithHeight(lines, '21px'),
        fontSize: theme.typography.pxToRem(14),
        wordBreak: 'break-word',
      },
    }),
    { name: 'PostCardDescription' },
  );

export type PostCardDescriptionProps = {
  children: React.ReactNode;
  truncate?: number;
};

export function PostCardDescription({
  children,
  truncate = 3,
}: PostCardDescriptionProps) {
  const classes = initStyle(truncate)();
  return (
    <CardContent className={classes.root}>
      <Typography
        className={classes.content}
        color="textSecondary"
        variant="body1"
        paragraph
      >
        {children}
      </Typography>
    </CardContent>
  );
}
