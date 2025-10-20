import type { BundledLanguage } from 'shiki';
import { transformerNotationDiff } from '@shikijs/transformers';
import { codeToHtml } from 'shiki';
import { CodeBlockClient } from './client';

export interface CodeBlockProps {
  lang?: BundledLanguage;
  title?: string;
  code?: string;
}

export async function CodeBlock({ lang = 'tsx', title, code }: CodeBlockProps) {
  const out = await codeToHtml(code || '', {
    lang: lang,
    themes: {
      light: 'min-light',
      dark: 'min-dark',
    },
    transformers: [transformerNotationDiff({ matchAlgorithm: 'v3' })],
  });

  return <CodeBlockClient out={out} title={title} />;
}
