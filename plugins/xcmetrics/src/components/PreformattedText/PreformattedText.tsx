/*
 * Copyright 2021 The Backstage Authors
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

import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';
import { BackstageTheme } from '@backstage/theme';
import { cn } from '../../utils';

const useStyles = makeStyles((theme: BackstageTheme) =>
  createStyles({
    pre: {
      whiteSpace: 'pre-line',
      wordBreak: 'break-all',
    },
    expandable: {
      cursor: 'pointer',
    },
    fullPre: {
      whiteSpace: 'pre-wrap',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  }),
);

interface PreformattedTextProps {
  text: string;
  maxChars: number;
}

interface ExpandableProps extends PreformattedTextProps {
  expandable: boolean;
  title: string;
}

interface NonExpandableProps extends PreformattedTextProps {
  expandable?: never;
  title?: string;
}

export const PreformattedText = ({
  text,
  maxChars,
  expandable,
  title,
}: NonExpandableProps | ExpandableProps) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (expandable && event.key === 'Enter') {
      setOpen(true);
    }
  };

  return (
    <>
      <div
        role={expandable ? 'button' : undefined}
        onClick={() => expandable && setOpen(true)}
        onKeyUp={handleKeyUp}
        tabIndex={expandable ? 0 : undefined}
      >
        <pre className={cn(classes.pre, expandable && classes.expandable)}>
          {text.slice(0, maxChars - 1).trim()}
          {text.length > maxChars - 1 && '…'}
        </pre>
      </div>

      {expandable && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          maxWidth="xl"
          fullWidth
        >
          <DialogTitle id="dialog-title">
            {title}
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <pre className={classes.fullPre}>{text}</pre>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
