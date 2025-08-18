import { isValidElement, ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';
import { CodeBlock } from '@/components/CodeBlock';
import styles from './css/mdx.module.css';

export const formattedMDXComponents: MDXComponents = {
  h1: ({ children }) => <h1 className={styles.h1}>{children as ReactNode}</h1>,
  h2: ({ children }) => <h2 className={styles.h2}>{children as ReactNode}</h2>,
  h3: ({ children }) => <h3 className={styles.h3}>{children as ReactNode}</h3>,
  p: ({ children }) => <p className={styles.p}>{children as ReactNode}</p>,
  a: ({ children, href }) => (
    <a href={href} className={styles.a}>
      {children as ReactNode}
    </a>
  ),
  ul: ({ children }) => <ul className={styles.ul}>{children as ReactNode}</ul>,
  li: ({ children }) => <li className={styles.li}>{children as ReactNode}</li>,
  pre: ({ children }) => {
    const codeContent = isValidElement(children)
      ? (children.props as { children: string }).children
      : '';

    return <CodeBlock lang="tsx" code={codeContent} />;
  },
  code: ({ children }) => (
    <code
      style={{
        fontFamily: 'var(--font-mono)',
        backgroundColor: 'var(--panel)',
        padding: '0.2rem 0.375rem',
        borderRadius: '0.25rem',
        color: 'var(--secondary)',
        border: '1px solid var(--border)',
        fontSize: '0.875rem',
      }}
    >
      {children}
    </code>
  ),
  img: ({ src, ...rest }) => (
    <Image
      src={`/backstage-external/backstage-portal/${src}`}
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
      {...(rest as Omit<ImageProps, 'src'>)}
    />
  ),
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...formattedMDXComponents,
    ...components,
  };
}
