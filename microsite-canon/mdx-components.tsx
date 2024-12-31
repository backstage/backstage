import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';
import { ReactNode, ReactElement } from 'react';
import React from 'react';
import { CodeBlock } from '@/components/CodeBlock';
import { Heading, Text, Box } from '@backstage/canon';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => (
      <Box marginBottom="md" style={{ marginTop: '4rem' }}>
        <Heading variant="title2">{children as ReactNode}</Heading>
      </Box>
    ),
    h2: ({ children }) => (
      <Box marginTop="xl" marginBottom="md">
        <Heading variant="title3">{children as ReactNode}</Heading>
      </Box>
    ),
    h3: ({ children }) => (
      <Box marginTop="lg" marginBottom="xs">
        <Heading variant="title4">{children as ReactNode}</Heading>
      </Box>
    ),
    p: ({ children }) => (
      <Box marginBottom="md">
        <Text variant="subtitle">{children as ReactNode}</Text>
      </Box>
    ),
    a: ({ children, href }) => (
      <a href={href} style={{ color: 'var(--canon-text-primary)' }}>
        {children as ReactNode}
      </a>
    ),
    pre: ({ children }) => {
      const codeContent = React.isValidElement(children)
        ? (children.props as { children: string }).children
        : '';

      return <CodeBlock lang="tsx" code={codeContent} />;
    },
    img: props => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        {...(props as ImageProps)}
      />
    ),
    ...components,
  };
}
