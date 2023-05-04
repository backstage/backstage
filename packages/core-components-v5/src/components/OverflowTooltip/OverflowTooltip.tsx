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

import { makeStyles } from 'tss-react/mui';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import React, { useState } from 'react';
import TextTruncate, { TextTruncateProps } from 'react-text-truncate';
import { useIsMounted } from '@react-hookz/web';

type Props = {
  text: TextTruncateProps['text'];
  line?: TextTruncateProps['line'];
  element?: TextTruncateProps['element'];
  title?: TooltipProps['title'];
  placement?: TooltipProps['placement'];
};

export type OverflowTooltipClassKey = 'container';

const useStyles = makeStyles({ name: 'BackstageOverflowTooltip' })({
  container: {
    overflow: 'visible !important',
  },
});

export function OverflowTooltip(props: Props) {
  const [hover, setHover] = useState(false);
  const isMounted = useIsMounted();
  const { classes } = useStyles();

  const handleToggled = (truncated: boolean) => {
    if (isMounted()) {
      setHover(truncated);
    }
  };

  return (
    <Tooltip
      title={props.title ?? (props.text || '')}
      placement={props.placement}
      disableHoverListener={!hover}
    >
      <TextTruncate
        text={props.text}
        line={props.line}
        onToggled={handleToggled}
        containerClassName={classes.container}
      />
    </Tooltip>
  );
}
