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

import React, { FC, useRef, useState } from 'react';
import { IconButton, makeStyles, Tooltip } from '@material-ui/core';
import CopyIcon from '@material-ui/icons/FileCopy';
import { BackstageTheme } from '@backstage/theme';
import { errorApiRef, useApi } from 'api';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  button: {
    '&:hover': {
      backgroundColor: theme.palette.highlight,
      cursor: 'pointer',
    },
  },
}));

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

const CopyTextButton: FC<Props> = props => {
  const { text, tooltipDelay, tooltipText } = {
    ...defaultProps,
    ...props,
  };
  const classes = useStyles(props);
  const errorApi = useApi(errorApiRef);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const handleCopyClick = e => {
    e.stopPropagation();
    setOpen(true);

    try {
      if (inputRef.current) {
        inputRef.current.select();
        document.execCommand('copy');
      }
    } catch (error) {
      errorApi.post(error);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        style={{ position: 'absolute', top: -9999, left: 9999 }}
        defaultValue={text}
      />
      <Tooltip
        id="copy-test-tooltip"
        title={tooltipText}
        placement="top"
        leaveDelay={tooltipDelay}
        onClose={() => setOpen(false)}
        open={open}
      >
        <IconButton onClick={handleCopyClick} className={classes.button}>
          <CopyIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default CopyTextButton;
