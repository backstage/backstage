import type { BundledLanguage } from 'shiki';
import { transformerNotationDiff } from '@shikijs/transformers';
import { codeToHtml } from 'shiki';
import { CodeBlockClient } from './client';

export interface CodeBlockProps {
  lang?: BundledLanguage;
  title?: string;
  code?: string;
}

export async function CodeBlock(props: CodeBlockProps) {
  const { lang = 'tsx', title, code } = props;
  let out = await codeToHtml(code || '', {
    lang,
    transformers: [transformerNotationDiff({ matchAlgorithm: 'v3' })],
    themes: {
      light: 'github-dark',
      dark: 'min-dark',
    },
  });

  // Remove background-color from the pre tag to use our theme colors
  out = out.replace(
    /style="([^"]*?)background-color:[^;]+;?([^"]*?)"/g,
    'style="$1$2"',
  );
  // Clean up empty style attributes
  out = out.replace(/style=""\s?/g, '');

  return <CodeBlockClient out={out} title={title} />;
}
