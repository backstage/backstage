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
import { IconButton } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { useArrowButtonStyles } from './DetailsCards.styles';

type Dir = 'left' | 'right';
interface Props {
  direction: Dir;
  onClick: () => void;
}

const ArrowButton = ({ direction, onClick }: Props) => {
  const classes = useArrowButtonStyles();
  const Icon = direction === 'left' ? ChevronLeftIcon : ChevronRightIcon;
  const posClass = direction === 'left' ? classes.prev : classes.next;

  return (
    <IconButton
      aria-label={`scroll ${direction}`}
      className={`${classes.root} ${posClass}`}
      onClick={onClick}
    >
      <Icon className={classes.icon} />
    </IconButton>
  );
};

export default ArrowButton;
