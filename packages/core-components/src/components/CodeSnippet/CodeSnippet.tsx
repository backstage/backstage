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

import Box from '@material-ui/core/Box';
import { useTheme } from '@material-ui/core/styles';
import React from 'react';
import type {} from 'react-syntax-highlighter';
import LightAsync from 'react-syntax-highlighter/dist/esm/light-async';
import dark from 'react-syntax-highlighter/dist/esm/styles/hljs/dark';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';

import { CopyTextButton } from '../CopyTextButton';

/**
 * Properties for {@link CodeSnippet}
 *
 * @public
 */
export interface CodeSnippetProps {
  /**
   * Code Snippet text
   */
  text: string;
  /**
   * Language used by {@link CodeSnippetProps.text}
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
 *
 * @public
 */
export function CodeSnippet(props: CodeSnippetProps) {
  const {
    text,
    language,
    showLineNumbers = false,
    highlightedNumbers,
    customStyle,
    showCopyCodeButton = false,
  } = props;
  const theme = useTheme();
  const mode = theme.palette.type === 'dark' ? dark : docco;
  const highlightColor = theme.palette.type === 'dark' ? '#256bf3' : '#e6ffed';

  return (
    <Box position="relative">
      <LightAsync
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
      </LightAsync>
      {showCopyCodeButton && (
        <Box position="absolute" top={0} right={0}>
          <CopyTextButton text={text} />
        </Box>
      )}
    </Box>
  );
}
