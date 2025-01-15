import React, { ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';
import { CodeBlock } from '@/components/CodeBlock';
import { Heading } from '../../packages/canon/src/components/Heading';
import { Box } from '../../packages/canon/src/components/Box';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => (
      <Box style={{ marginTop: '4rem' }}>
        <h1
          style={{
            fontFamily: 'var(--docs-font)',
            fontSize: '3rem',
            fontWeight: 'var(--canon-font-weight-bold)',
            margin: 0,
          }}
        >
          {children as ReactNode}
        </h1>
      </Box>
    ),
    h2: ({ children }) => (
      <Box marginTop="2xl" marginBottom="md">
        <h2
          style={{
            fontFamily: 'var(--docs-font)',
            fontSize: '1.5rem',
            fontWeight: 'var(--canon-font-weight-bold)',
          }}
        >
          {children as ReactNode}
        </h2>
      </Box>
    ),
    h3: ({ children }) => (
      <Box marginTop="xl" marginBottom="xs">
        <h3
          style={{
            fontFamily: 'var(--docs-font)',
            fontSize: '1.25rem',
            fontWeight: 'var(--canon-font-weight-bold)',
          }}
        >
          {children as ReactNode}
        </h3>
      </Box>
    ),
    p: ({ children }) => (
      <Box marginBottom="sm">
        <p
          style={{
            fontFamily: 'var(--docs-font)',
            fontSize: '1rem',
            lineHeight: '1.5',
          }}
        >
          {children as ReactNode}
        </p>
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
    code: ({ children }) => (
      <code
        style={{
          fontFamily: 'var(--canon-font-monospace)',
          backgroundColor: 'var(--canon-surface-1)',
          padding: '0.2rem 0.375rem',
          borderRadius: '0.25rem',
          color: 'var(--canon-text-secondary)',
          border: '1px solid var(--canon-border-base)',
          fontSize: '0.875rem',
        }}
      >
        {children}
      </code>
    ),
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
