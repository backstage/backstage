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
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CopyIcon from '@material-ui/icons/FileCopy';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

/**
 * Properties for {@link CopyTextButton}
 *
 * @public
 */
export interface CopyTextButtonProps {
  /**
   * The text to be copied
   */
  text: string;
  /**
   * Number of milliseconds that the tooltip is shown
   *
   * @remarks
   *
   * Default: 1000
   */
  tooltipDelay?: number;
  /**
   * Text to show in the tooltip when user has clicked the button
   *
   * @remarks
   *
   * Default: "Text copied to clipboard"
   */
  tooltipText?: string;
}

/**
 * Copy text button with visual feedback
 *
 * @public
 * @remarks
 *
 * Visual feedback takes form of:
 *  - a hover color
 *  - click ripple
 *  - Tooltip shown when user has clicked
 *
 * @example
 *
 * `<CopyTextButton text="My text that I want to be copied to the clipboard" />`
 */
export function CopyTextButton(props: CopyTextButtonProps) {
  const {
    text,
    tooltipDelay = 1000,
    tooltipText = 'Text copied to clipboard',
  } = props;
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
