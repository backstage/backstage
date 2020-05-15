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

import React, { FC } from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco, dark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { useTheme } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';

type Props = {
  text: string;
  language: string;
  showLineNumbers?: boolean;
};

const defaultProps = {
  showLineNumbers: false,
};

const CodeSnippet: FC<Props> = (props) => {
  const { text, language, showLineNumbers } = {
    ...defaultProps,
    ...props,
  };

  const theme = useTheme<BackstageTheme>();
  const mode = theme.palette.type === 'dark' ? dark : docco;

  return (
    <SyntaxHighlighter
      language={language}
      style={mode}
      showLineNumbers={showLineNumbers}
    >
      {text}
    </SyntaxHighlighter>
  );
};

// Type check for the JS files using this core component
CodeSnippet.propTypes = {
  text: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  showLineNumbers: PropTypes.bool,
};

export default CodeSnippet;
