import React, { ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';
import { CodeBlock } from '@/components/CodeBlock';
import { Box } from '../../packages/canon/src/components/Box';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <Box style={{ marginTop: '4rem' }}>
        <h1
          style={{
            fontFamily: 'var(--docs-font)',
            fontSize: '3rem',
            fontWeight: 'var(--canon-font-weight-bold)',
            marginTop: '4rem',
            marginBottom: '0.5rem',
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
      <h3
        style={{
          fontFamily: 'var(--docs-font)',
          fontSize: '1.25rem',
          fontWeight: 'var(--canon-font-weight-bold)',
          marginTop: '2rem',
          marginBottom: '0.5rem',
        }}
      >
        {children as ReactNode}
      </h3>
    ),
    p: ({ children }) => (
      <p
        style={{
          fontFamily: 'var(--docs-font)',
          fontSize: '1rem',
          lineHeight: '1.5',
          marginTop: '0',
          marginBottom: '1rem',
        }}
      >
        {children as ReactNode}
      </p>
    ),
    a: ({ children, href }) => (
      <a href={href} style={{ color: 'var(--canon-fg-text-primary)' }}>
        {children as ReactNode}
      </a>
    ),
    li: ({ children }) => (
      <li style={{ marginBottom: '0.5rem' }}>{children as ReactNode}</li>
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
          backgroundColor: 'var(--canon-bg-elevated)',
          padding: '0.2rem 0.375rem',
          borderRadius: '0.25rem',
          color: 'var(--canon-fg-text-secondary)',
          border: '1px solid var(--canon-border)',
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
