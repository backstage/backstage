import { CodeBlock } from '../CodeBlock';
import { SnippetClient } from './client';

interface SnippetProps {
  preview: JSX.Element;
  code: string;
  align?: 'left' | 'center';
  px?: number;
  py?: number;
  open?: boolean;
  height?: string | number;
}

export const Snippet = ({
  preview,
  code = '',
  align = 'left',
  px = 2,
  py = 2,
  open = false,
  height = 'auto',
}: SnippetProps) => {
  return (
    <SnippetClient
      preview={preview}
      codeContent={<CodeBlock code={code} />}
      align={align}
      px={px}
      py={py}
      open={open}
      height={height}
    />
  );
};
