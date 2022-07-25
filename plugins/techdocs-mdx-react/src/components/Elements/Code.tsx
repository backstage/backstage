/*
 * Copyright 2022 The Backstage Authors
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

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy, okaidia } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import clsx from 'clsx';
import { makeStyles, Tooltip, IconButton, SvgIcon } from '@material-ui/core';

import { useApi, appThemeApiRef } from '@backstage/core-plugin-api';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    '&:hover > button:not(:hover)': {
      color: theme.palette.text.primary,
    },
  },
  code: {
    padding: theme.spacing(1, 1.5),
    background: theme.palette.background.paper,
    '& .linenumber': {
      minWidth: 'auto !important',
      marginRight: theme.spacing(1.5),
      boxShadow: `inset -0.05rem 0 ${theme.palette.text.secondary}`,
    },
    '& .string': {
      color:
        theme.palette.type === 'dark'
          ? theme.palette.success.light
          : theme.palette.success.dark,
    },
    '& .number': {
      color:
        theme.palette.type === 'dark'
          ? theme.palette.error.light
          : theme.palette.error.dark,
    },
    '& .keyword': {
      color:
        theme.palette.type === 'dark'
          ? theme.palette.primary.light
          : theme.palette.primary.dark,
    },
    '& .function, & .special, & .constant': {
      color:
        theme.palette.type === 'dark'
          ? theme.palette.secondary.light
          : theme.palette.secondary.dark,
    },
    '& .comment, & .generic, & .variable, & .operator, & .punctuation': {
      color: theme.palette.text.secondary,
    },
  },
  codeInline: {
    background: theme.palette.background.paper,
  },
  tooltip: {
    fontSize: 'inherit',
    color: theme.palette.text.primary,
    margin: 0,
    padding: theme.spacing(0.5),
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  button: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
    },
  },
}));

const CopyIcon = () => (
  <SvgIcon>
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
  </SvgIcon>
);

const Code = ({ className = '', children }: JSX.IntrinsicElements['code']) => {
  const classes = useStyles();

  const themeApi = useApi(appThemeApiRef);
  const themeId = themeApi.getActiveThemeId();
  const match = /language-(\w+)/.exec(className);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lineNumbers =
      ref.current?.querySelectorAll<HTMLElement>('.linenumber');
    if (!lineNumbers?.length) return;
    const lastLineNumber = lineNumbers[lineNumbers.length - 1];
    const lastLineNumberStyle = getComputedStyle(lastLineNumber);
    for (const lineNumber of lineNumbers) {
      lineNumber.style.width = lastLineNumberStyle.width;
    }
  }, []);

  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(String(children));
    setOpen(true);
  }, [children]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return match ? (
    <div className={classes.root}>
      <Tooltip
        classes={{ tooltip: classes.tooltip }}
        title="Copied to clipboard"
        placement="left"
        open={open}
        onClose={handleClose}
        leaveDelay={1000}
      >
        <IconButton
          className={classes.button}
          edge="end"
          size="small"
          aria-label="copy to clipboard"
          onClick={handleClick}
          disableRipple
        >
          <CopyIcon />
        </IconButton>
      </Tooltip>
      <SyntaxHighlighter
        language={match[1]}
        useInlineStyles={false}
        fact="syntaxhighlighter"
        className={clsx(className, classes.code)}
        style={themeId === 'dark' ? okaidia : coy}
        children={String(children).replace(/\n$/, '')}
        showLineNumbers
        codeTagProps={{ ref }}
      />
    </div>
  ) : (
    <code className={clsx(className, classes.codeInline)}>{children}</code>
  );
};

export { Code as code };
