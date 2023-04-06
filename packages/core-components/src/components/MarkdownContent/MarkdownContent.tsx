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
import ReactMarkdown, { Options } from 'react-markdown';
import gfm from 'remark-gfm';
import React from 'react';
import { BackstageTheme } from '@backstage/theme';
import { CodeSnippet } from '../CodeSnippet';
import { HeadingProps } from 'react-markdown/lib/ast-to-react';

export type MarkdownContentClassKey = 'markdown';

const useStyles = makeStyles<BackstageTheme>(
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

type Props = {
  content: string;
  dialect?: 'gfm' | 'common-mark';
  linkTarget?: Options['linkTarget'];
  transformLinkUri?: (href: string) => string;
  transformImageUri?: (href: string) => string;
  className?: string;
};

const flatten = (text: string, child: any): string => {
  if (!child) return text;

  return typeof child === 'string'
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text);
};

const headingRenderer = ({ level, children }: HeadingProps) => {
  const childrenArray = React.Children.toArray(children);
  const text = childrenArray.reduce(flatten, '');
  const slug = text.toLocaleLowerCase('en-US').replace(/\W/g, '-');
  return React.createElement(`h${level}`, { id: slug }, children);
};

const components: Options['components'] = {
  code: ({ inline, className, children, ...props }) => {
    const text = String(children).replace(/\n+$/, '');
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <CodeSnippet language={match[1]} text={text} />
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  h1: headingRenderer,
  h2: headingRenderer,
  h3: headingRenderer,
  h4: headingRenderer,
  h5: headingRenderer,
  h6: headingRenderer,
};

/**
 * Renders markdown with the default dialect {@link https://github.github.com/gfm/ | gfm - GitHub flavored Markdown} to backstage theme styled HTML.
 *
 * @remarks
 * If you just want to render to plain {@link https://commonmark.org/ | CommonMark}, set the dialect to `'common-mark'`
 */
export function MarkdownContent(props: Props) {
  const {
    content,
    dialect = 'gfm',
    linkTarget,
    transformLinkUri,
    transformImageUri,
    className,
  } = props;
  const classes = useStyles();
  return (
    <ReactMarkdown
      remarkPlugins={dialect === 'gfm' ? [gfm] : []}
      className={`${classes.markdown} ${className}`}
      children={content}
      components={components}
      linkTarget={linkTarget}
      transformLinkUri={transformLinkUri}
      transformImageUri={transformImageUri}
    />
  );
}
