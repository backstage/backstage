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

import ReactMarkdown, { type Options } from 'react-markdown';
import gfm from 'remark-gfm';
import { Children, createElement } from 'react';
import { CodeSnippet } from '../CodeSnippet';
import type { HeadingProps } from 'react-markdown/lib/ast-to-react';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import type { PluggableList } from 'react-markdown/lib/react-markdown';
import { Link } from '../Link';
import type { Props as MarkdownContentProps } from './MarkdownContent';

const flatten = (text: string, child: any): string => {
  if (!child) return text;

  return typeof child === 'string'
    ? text + child
    : Children.toArray(child.props.children).reduce(flatten, text);
};

const headingRenderer = ({ level, children }: HeadingProps) => {
  const childrenArray = Children.toArray(children);
  const text = childrenArray.reduce(flatten, '');
  const slug = text.toLowerCase().replace(/\W/g, '-');
  return createElement(`h${level}`, { id: slug }, children);
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

  a: ({ href, children, title, target, rel }) =>
    href ? (
      <Link
        to={href}
        title={title}
        {...(target ? { target } : {})}
        {...(rel ? { rel } : {})}
      >
        {children}
      </Link>
    ) : (
      <>{children}</>
    ),
};

const gfmRehypePlugins: PluggableList = [
  [
    rehypeRaw,
    {
      tagfilter: true,
    },
  ],
  [
    rehypeSanitize,
    {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,
        code: [
          ...(defaultSchema.attributes?.code ?? []),
          // for syntax highlighting classes in code blocks
          // breaks the codesnippet component override above if omitted
          ['className'],
        ],
      },
    },
  ],
];

/**
 * The markdown renderer behind {@link MarkdownContent}. It lives in its own
 * module so that react-markdown and its remark and rehype plugins load on
 * first use instead of with the app.
 */
export default function MarkdownRenderer(
  props: MarkdownContentProps & { className: string },
) {
  const {
    content,
    dialect = 'gfm',
    linkTarget,
    transformLinkUri,
    transformImageUri,
    className,
  } = props;
  return (
    <ReactMarkdown
      remarkPlugins={dialect === 'gfm' ? [gfm] : []}
      rehypePlugins={dialect === 'gfm' ? gfmRehypePlugins : []}
      className={className}
      children={content}
      components={components}
      linkTarget={linkTarget}
      transformLinkUri={transformLinkUri}
      transformImageUri={transformImageUri}
    />
  );
}
