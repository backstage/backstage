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

import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { IconButton, Tooltip } from '@material-ui/core';
import CopyIcon from '@material-ui/icons/FileCopy';
import PropTypes from 'prop-types';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

/**
 * Copy text button with visual feedback in the form of
 *  - a hover color
 *  - click ripple
 *  - Tooltip shown when user has clicked
 *
 *  Properties:
 *  - text: the text to be copied
 *  - tooltipDelay: Number os ms to show the tooltip, default: 1000ms
 *  - tooltipText: Text to show in the tooltip when user has clicked the button, default: "Text
 * copied to clipboard"
 *
 * Example:
 *    <CopyTextButton text="My text that I want to be copied to the clipboard" />
 */
type Props = {
  text: string;
  tooltipDelay?: number;
  tooltipText?: string;
};

const defaultProps = {
  tooltipDelay: 1000,
  tooltipText: 'Text copied to clipboard',
};

export function CopyTextButton(props: Props) {
  const { text, tooltipDelay, tooltipText } = {
    ...defaultProps,
    ...props,
  };
  const errorApi = useApi(errorApiRef);
  const [open, setOpen] = useState(false);
  const [{ error }, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  const handleCopyClick: MouseEventHandler = e => {
    e.stopPropagation();
    setOpen(true);
    copyToClipboard(text);
  };

  return (
    <>
      <Tooltip
        id="copy-test-tooltip"
        title={tooltipText}
        placement="top"
        leaveDelay={tooltipDelay}
        onClose={() => setOpen(false)}
        open={open}
      >
        <IconButton onClick={handleCopyClick}>
          <CopyIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}

// Type check for the JS files using this core component
CopyTextButton.propTypes = {
  text: PropTypes.string.isRequired,
  tooltipDelay: PropTypes.number,
  tooltipText: PropTypes.string,
};
