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

import React, { lazy, Suspense } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { BackstageTheme } from '@backstage/theme';
import { CopyTextButton } from '../CopyTextButton';
import { Progress } from '../Progress';

const LazySyntaxHighlighter = lazy(async () => {
  const [{ default: SyntaxHighlighter }, { docco, dark }] = await Promise.all([
    import('react-syntax-highlighter'),
    import('react-syntax-highlighter/dist/cjs/styles/hljs'),
  ]);

  function LazyHighlighter(props: CodeSnippetProps) {
    const {
      text,
      language,
      showLineNumbers = false,
      highlightedNumbers,
      customStyle,
    } = props;
    const theme = useTheme<BackstageTheme>();
    const mode = theme.palette.type === 'dark' ? dark : docco;
    const highlightColor =
      theme.palette.type === 'dark' ? '#256bf3' : '#e6ffed';

    return (
      <SyntaxHighlighter
        customStyle={customStyle}
        language={language}
        style={mode}
        showLineNumbers={showLineNumbers}
        wrapLines
        lineNumberStyle={{ color: theme.palette.textVerySubtle }}
        lineProps={(lineNumber: number) =>
          highlightedNumbers?.includes(lineNumber)
            ? {
                style: {
                  backgroundColor: highlightColor,
                },
              }
            : {}
        }
      >
        {text}
      </SyntaxHighlighter>
    );
  }

  return { default: LazyHighlighter };
});

/**
 * Properties for {@link CodeSnippet}
 */
export interface CodeSnippetProps {
  /**
   * Code Snippet text
   */
  text: string;
  /**
   * Language used by {@link .text}
   */
  language: string;
  /**
   * Whether to show line number
   *
   * @remarks
   *
   * Default: false
   */
  showLineNumbers?: boolean;
  /**
   * Whether to show button to copy code snippet
   *
   * @remarks
   *
   * Default: false
   */
  showCopyCodeButton?: boolean;
  /**
   * Array of line numbers to highlight
   */
  highlightedNumbers?: number[];
  /**
   * Custom styles applied to code
   *
   * @remarks
   *
   * Passed to {@link https://react-syntax-highlighter.github.io/react-syntax-highlighter/ | react-syntax-highlighter}
   */
  customStyle?: any;
}

/**
 * Thin wrapper on top of {@link https://react-syntax-highlighter.github.io/react-syntax-highlighter/ | react-syntax-highlighter}
 * providing consistent theming and copy code button
 */
export function CodeSnippet(props: CodeSnippetProps) {
  const { text, showCopyCodeButton = false } = props;
  return (
    <div style={{ position: 'relative' }}>
      <Suspense fallback={<Progress />}>
        <LazySyntaxHighlighter {...props} />
      </Suspense>
      {showCopyCodeButton && (
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <CopyTextButton text={text} />
        </div>
      )}
    </div>
  );
}
