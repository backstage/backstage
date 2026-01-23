import { isValidElement, ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';
import { CodeBlock } from '@/components/CodeBlock';
import styles from './css/mdx.module.css';

// Utility function to generate slug from heading text
function slugify(text: string): string {
  return text
    .toString()
    .toLocaleLowerCase('en-US')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Component for heading with anchor link
function HeadingWithAnchor({
  level,
  children,
  className,
}: {
  level: number;
  children: ReactNode;
  className: string;
}) {
  const text =
    typeof children === 'string'
      ? children
      : Array.isArray(children)
      ? children.join('')
      : '';
  const id = slugify(text);

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag id={id} className={`${className} ${styles.headingWithAnchor}`}>
      <a href={`#${id}`} className={styles.anchorLink}>
        {children}
        <span className={styles.anchorHash}>#</span>
      </a>
    </Tag>
  );
}

export const formattedMDXComponents: MDXComponents = {
  h1: ({ children }) => <h1 className={styles.h1}>{children as ReactNode}</h1>,
  h2: ({ children }) => (
    <HeadingWithAnchor level={2} className={styles.h2}>
      {children as ReactNode}
    </HeadingWithAnchor>
  ),
  h3: ({ children }) => (
    <HeadingWithAnchor level={3} className={styles.h3}>
      {children as ReactNode}
    </HeadingWithAnchor>
  ),
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
        backgroundColor: 'var(--bg)',
        padding: '0.2rem 0.375rem',
        borderRadius: '0.25rem',
        color: 'var(--primary)',
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
  table: ({ children }) => (
    <table className={styles.table}>{children as ReactNode}</table>
  ),
  th: ({ children }) => <th className={styles.th}>{children as ReactNode}</th>,
  td: ({ children }) => <td className={styles.td}>{children as ReactNode}</td>,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...formattedMDXComponents,
    ...components,
  };
}
