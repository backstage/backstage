/*
 * Copyright 2020 Spotify AB
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

import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco, dark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { useTheme } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import { CopyTextButton } from '../CopyTextButton';

type Props = {
  text: string;
  language: string;
  showLineNumbers?: boolean;
  showCopyCodeButton?: boolean;
  highlightedNumbers?: number[];
};

export const CodeSnippet = ({
  text,
  language,
  showLineNumbers = false,
  showCopyCodeButton = false,
  highlightedNumbers,
}: Props) => {
  const theme = useTheme<BackstageTheme>();
  const mode = theme.palette.type === 'dark' ? dark : docco;

  return (
    <div style={{ position: 'relative' }}>
      <SyntaxHighlighter
        language={language}
        style={mode}
        showLineNumbers={showLineNumbers}
        wrapLines
        lineProps={(lineNumber: number) =>
          highlightedNumbers?.includes(lineNumber)
            ? { style: { backgroundColor: '#e6ffed' } }
            : {}
        }
      >
        {text}
      </SyntaxHighlighter>
      {showCopyCodeButton && (
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <CopyTextButton text={text} />
        </div>
      )}
    </div>
  );
};
