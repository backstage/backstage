/*
 * Copyright 2020 Spotify AB
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

import { makeStyles } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import React from 'react';

const useStyles = makeStyles(theme => ({
  markdown: {
    '& table': {
      borderCollapse: 'collapse',
      border: '1px solid #dfe2e5',
      color: 'rgb(36, 41, 46)',
    },
    '& th, & td': {
      border: '1px solid #dfe2e5',
      padding: theme.spacing(1),
    },
    '& tr': {
      backgroundColor: '#fff',
    },
    '& tr:nth-child(2n)': {
      backgroundColor: '#f6f8fa',
    },
    '& pre': {
      padding: '16px',
      overflow: 'auto',
      fontSize: '85%',
      lineHeight: 1.45,
      backgroundColor: '#f6f8fa',
      borderRadius: '6px',
      color: 'rgba(0, 0, 0, 0.87)',
    },
    '& a': {
      color: '#2E77D0',
    },
    '& img': {
      maxWidth: '100%',
    },
  },
}));

/**
 * MarkdownContent. Renders markdown (CommonMark, optionally with [GFM](https://github.com/remarkjs/remark-gfm)) to formatted HTML.
 */
type Props = {
  content: string;
  enableGfm?: boolean;
};

export const MarkdownContent = ({ content, enableGfm = false }: Props) => {
  const classes = useStyles();
  return (
    <ReactMarkdown
      plugins={enableGfm ? [gfm] : []}
      className={classes.markdown}
      children={content}
    />
  );
};
