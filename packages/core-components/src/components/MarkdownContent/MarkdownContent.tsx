/*
 * Copyright 2020 The Backstage Authors
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
import type { Options } from 'react-markdown';
import { lazy, Suspense } from 'react';

export type MarkdownContentClassKey = 'markdown';

const useStyles = makeStyles(
  theme => ({
    markdown: {
      '& table': {
        borderCollapse: 'collapse',
        border: `1px solid ${theme.palette.border}`,
      },
      '& th, & td': {
        border: `1px solid ${theme.palette.border}`,
        padding: theme.spacing(1),
      },
      '& td': {
        wordBreak: 'break-word',
        overflow: 'hidden',
        verticalAlign: 'middle',
        lineHeight: '1',
        margin: 0,
        padding: theme.spacing(3, 2, 3, 2.5),
        borderBottom: 0,
      },
      '& th': {
        backgroundColor: theme.palette.background.paper,
      },
      '& tr': {
        backgroundColor: theme.palette.background.paper,
      },
      '& tr:nth-child(odd)': {
        backgroundColor: theme.palette.background.default,
      },

      '& a': {
        color: theme.palette.link,
      },
      '& img': {
        maxWidth: '100%',
      },
    },
  }),
  { name: 'BackstageMarkdownContent' },
);

export type Props = {
  content: string;
  dialect?: 'gfm' | 'common-mark';
  linkTarget?: Options['linkTarget'];
  transformLinkUri?: (href: string) => string;
  transformImageUri?: (href: string) => string;
  className?: string;
};

const MarkdownRenderer = lazy(() => import('./MarkdownRenderer'));

/**
 * Renders markdown with the default dialect {@link https://github.github.com/gfm/ | gfm - GitHub flavored Markdown} to backstage theme styled HTML.
 *
 * @remarks
 * If you just want to render to plain {@link https://commonmark.org/ | CommonMark}, set the dialect to `'common-mark'`
 *
 * The markdown renderer loads the first time this component renders, so the
 * first render shows nothing until it has loaded. Tests that render this
 * component synchronously should await the content, for example with
 * `findBy*` queries.
 */
export function MarkdownContent(props: Props) {
  const classes = useStyles();
  return (
    <Suspense fallback={null}>
      <MarkdownRenderer
        {...props}
        className={`${classes.markdown} ${props.className ?? ''}`.trim()}
      />
    </Suspense>
  );
}
