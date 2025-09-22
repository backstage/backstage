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

import { makeStyles } from '@material-ui/core/styles';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

type Props = {
  text?: string | undefined;
  title?: TooltipProps['title'];
  line?: number | undefined;
  placement?: TooltipProps['placement'];
};

export type OverflowTooltipClassKey = 'container';

const useStyles = makeStyles(
  {
    container: {
      overflow: 'visible !important',
    },
    typo: {
      fontSize: 'inherit',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      '-webkit-line-clamp': ({ line }: Props) => line || 1,
      '-webkit-box-orient': 'vertical',
    },
  },
  { name: 'BackstageOverflowTooltip' },
);

export function OverflowTooltip(props: Props) {
  const classes = useStyles(props);

  return (
    <Tooltip
      title={props.title ?? (props.text || '')}
      placement={props.placement}
    >
      <Typography className={classes.typo} variant="inherit">
        {props.text}
      </Typography>
    </Tooltip>
  );
}
