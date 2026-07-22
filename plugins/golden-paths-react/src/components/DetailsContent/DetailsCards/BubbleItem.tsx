/*
 * Copyright 2026 The Backstage Authors
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
import { Box, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { useBubbleItemStyles } from './DetailsCards.styles';

interface Props {
  label: string;
  isFirst?: boolean;
  isCompleted?: boolean;
  isDisabled?: boolean;
}

const BubbleItem = ({
  label,
  isFirst = false,
  isCompleted = false,
  isDisabled = false,
}: Props) => {
  const classes = useBubbleItemStyles();
  const offsetClass = isFirst ? classes.firstOffset : classes.lastOffset;
  const wrapperClass = [
    classes.clickable,
    offsetClass,
    isDisabled && classes.disabled,
  ]
    .filter(Boolean)
    .join(' ');

  const renderBall = () => {
    if (isDisabled) {
      return <Box className={classes.disabledBall} />;
    }

    if (isCompleted) {
      return (
        <Box className={classes.completedBall}>
          <CheckIcon className={classes.checkIcon} />
        </Box>
      );
    }

    return <Box className={classes.ball} />;
  };

  return (
    <Box className={wrapperClass} role="button">
      <Box className={classes.ballContainer}>
        {renderBall()}
        <Typography
          className={[classes.text, isDisabled && classes.disabledText]
            .filter(Boolean)
            .join(' ')}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

export default BubbleItem;
