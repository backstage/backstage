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
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { truncateLinesWithHeight } from './truncateLinesWithHeight';
import CardHeader from '@material-ui/core/CardHeader';

const initStyle = (lines: number) =>
  makeStyles(
    theme => ({
      title: {
        ...truncateLinesWithHeight(
          lines,
          '1.167',
          theme.typography.pxToRem(16),
        ),
      },
    }),
    { name: 'PostCardTitle' },
  );

export type PostCardTitleProps = {
  children: React.ReactNode;
  truncate?: number;
};

export function PostCardTitle({ children, truncate = 1 }: PostCardTitleProps) {
  const classes = initStyle(truncate)();
  return (
    <CardHeader
      title={children}
      classes={{
        title: classes.title,
      }}
      color="textPrimary"
    />
  );
}
