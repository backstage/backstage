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
import { makeStyles, useTheme } from '@material-ui/core/styles';
import React, { useEffect, useRef } from 'react';
import type {} from 'react-syntax-highlighter';
import LightAsync from 'react-syntax-highlighter/dist/esm/light-async';
import lioshi from 'react-syntax-highlighter/dist/esm/styles/hljs/lioshi';
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
   * Choose any hightlighter style from {@link https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo/ | react-syntax-highlighter}
   */
  highlighterStyle?: { [key: string]: React.CSSProperties } | undefined;
  /**
   * Array of line numbers to highlight
   */
  highlightedNumbers?: number[];
  /**
   * Line number to scroll to. It uses a parent container (e.g. whole page) to scroll to given line.
   */
  scrollToLine?: number;
  /**
   * Custom styles applied to code
   *
   * @remarks
   *
   * Passed to {@link https://react-syntax-highlighter.github.io/react-syntax-highlighter/ | react-syntax-highlighter}
   */
  customStyle?: any;
}

const useStyles = makeStyles(
  theme => ({
    highlight: {
      backgroundColor: theme.palette.type === 'dark' ? '#0078D7' : '#e6ffed',
    },
  }),
  { name: 'BackstageCodeSnippet' },
);

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
    highlighterStyle,
    customStyle,
    scrollToLine,
    showCopyCodeButton = false,
  } = props;
  const theme = useTheme();

  let mode: typeof highlighterStyle;
  if (highlighterStyle) {
    mode = highlighterStyle;
  } else {
    mode = theme.palette.type === 'dark' ? lioshi : docco;
  }

  const lineNumberRef = useRef<React.RefObject<HTMLDivElement>>();

  const classes = useStyles();

  useEffect(() => {
    if (!scrollToLine) {
      return;
    }
    // wrapped in setTimeout to ensure that the line number ref is created
    setTimeout(() => {
      lineNumberRef.current?.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  }, [scrollToLine]);

  return (
    <Box position="relative">
      <LightAsync
        customStyle={customStyle}
        language={language}
        style={mode}
        showLineNumbers={showLineNumbers}
        wrapLines
        lineNumberStyle={{ color: theme.palette.textVerySubtle }}
        lineProps={(lineNumber: number) => {
          const ref =
            lineNumber === scrollToLine
              ? (lineNumberRef.current = React.createRef())
              : undefined;
          return highlightedNumbers?.includes(lineNumber)
            ? {
                ref,
                class: classes.highlight,
              }
            : {
                ref,
              };
        }}
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
