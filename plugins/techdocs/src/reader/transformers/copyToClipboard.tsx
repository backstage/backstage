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

import { useState, useCallback, useEffect } from 'react';
import { renderReactElement } from './renderReactElement';
import { Copy } from 'lucide-react';
import type { Transformer } from './transformer';
import useCopyToClipboard from 'react-use/esm/useCopyToClipboard';

/**
 * Simple feedback indicator for copy-to-clipboard action in shadow DOM context.
 * Uses inline styles instead of Tailwind/CSS-in-JS since this component renders
 * into shadow DOM where external stylesheets may not be available.
 */
const CopyFeedback = ({ show }: { show: boolean }) =>
  show ? (
    <span
      style={{
        position: 'absolute',
        right: '2.5rem',
        top: '0.75rem',
        fontSize: 'inherit',
        color: 'var(--md-default-fg-color, inherit)',
        backgroundColor: 'transparent',
        whiteSpace: 'nowrap',
      }}
    >
      Copied to clipboard
    </span>
  ) : null;

type CopyToClipboardButtonProps = {
  text: string;
};

const CopyToClipboardButton = ({ text }: CopyToClipboardButtonProps) => {
  const [open, setOpen] = useState(false);
  const [, copyToClipboard] = useCopyToClipboard();

  const handleClick = useCallback(() => {
    copyToClipboard(text);
    setOpen(true);
  }, [text, copyToClipboard]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  // Auto-dismiss the "Copied to clipboard" feedback after 1 second,
  // matching the original MUI Tooltip leaveDelay behavior.
  useEffect(() => {
    if (!open) return undefined;
    const timer = window.setTimeout(() => {
      setOpen(false);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <div style={{ position: 'relative' }}>
      <CopyFeedback show={open} />
      <button
        style={{
          position: 'absolute',
          // top & right was removed from upstream .md-clipboard in mkdocs-material 9.7.0
          top: '0.5rem',
          right: '0.5rem',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.375rem',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: '0.25rem',
          color: 'inherit',
          width: '2rem',
          height: '2rem',
        }}
        className="md-clipboard md-icon"
        onClick={handleClick}
        onBlur={handleClose}
        aria-label="Copy to clipboard"
      >
        <Copy style={{ width: '1rem', height: '1rem' }} />
      </button>
    </div>
  );
};

/**
 * Recreates copy-to-clipboard functionality attached to <code> snippets that
 * is native to mkdocs-material theme.
 *
 * Unlike native mkdocs-material theme, this is always enabled and does not respect the mkdocs's config `theme.features` `content.code.copy` setting.
 */
export const copyToClipboard = (): Transformer => {
  return dom => {
    const codes = dom.querySelectorAll('pre > code');
    for (const code of codes) {
      const text = code.textContent || '';
      const container = document.createElement('div');
      code?.parentElement?.prepend(container);
      renderReactElement(<CopyToClipboardButton text={text} />, container);
    }
    return dom;
  };
};
