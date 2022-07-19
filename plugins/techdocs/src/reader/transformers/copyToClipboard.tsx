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

import React, { useState, useCallback } from 'react';
import ReactDom from 'react-dom';
import {
  withStyles,
  Theme,
  ThemeProvider,
  SvgIcon,
  Tooltip,
} from '@material-ui/core';

const CopyToClipboardTooltip = withStyles(theme => ({
  tooltip: {
    fontSize: 'inherit',
    color: theme.palette.text.primary,
    margin: 0,
    padding: theme.spacing(0.5),
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
}))(Tooltip);

const CopyToClipboardIcon = () => (
  <SvgIcon>
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
  </SvgIcon>
);

type CopyToClipboardButtonProps = {
  text: string;
};

const CopyToClipboardButton = ({ text }: CopyToClipboardButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(text);
    setOpen(true);
  }, [text]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <CopyToClipboardTooltip
      title="Copied to clipboard"
      placement="left"
      open={open}
      onClose={handleClose}
      leaveDelay={1000}
    >
      <button className="md-clipboard md-icon" onClick={handleClick}>
        <CopyToClipboardIcon />
      </button>
    </CopyToClipboardTooltip>
  );
};

import type { Transformer } from './transformer';

/**
 * Recreates copy-to-clipboard functionality attached to <code> snippets that
 * is native to mkdocs-material theme.
 */
export const copyToClipboard = (theme: Theme): Transformer => {
  return dom => {
    const codes = dom.querySelectorAll('pre > code');
    for (const code of codes) {
      const text = code.textContent || '';
      const container = document.createElement('div');
      code?.parentElement?.prepend(container);
      ReactDom.render(
        <ThemeProvider theme={theme}>
          <CopyToClipboardButton text={text} />
        </ThemeProvider>,
        container,
      );
    }
    return dom;
  };
};
