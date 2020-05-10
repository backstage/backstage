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
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { BackstageTheme } from '@backstage/theme';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco, dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type Props = {
  text: string;
  language: string;
};

const defaultProps = {};

const CodeSnippet: FC<Props> = props => {
  const { text, language } = {
    ...defaultProps,
    ...props,
  };

  // FIXME: There must be a better way of accessing the theme.
  //        ThemeContext.Consumer looks promising but didn't cooperate
  let mode = dark;
  makeStyles<BackstageTheme>(theme => {
    mode = theme.palette.type === 'dark' ? dark : docco;
    return {};
  })();

  return (
    <SyntaxHighlighter language={language} style={mode}>
      {text}
    </SyntaxHighlighter>
  );
};

// Type check for the JS files using this core component
CodeSnippet.propTypes = {
  text: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
};

export default CodeSnippet;
