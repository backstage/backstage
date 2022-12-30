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

import { Popover } from '@material-ui/core';

const topItemPopOverTransformsBottomRight = {
  anchorOrigin: { horizontal: 'left', vertical: 'bottom' },
  transformOrigin: { horizontal: 'left', vertical: 'top' },
} as const;

const topItemPopOverTransformsTopRight = {
  anchorOrigin: { horizontal: 'left', vertical: 'top' },
  transformOrigin: { horizontal: 'left', vertical: 'bottom' },
} as const;

export type PopOverFabContentProps<P = {}> = P & {
  close: () => void;
};

export interface PopOverFabProps<FP, ContentProps> {
  content: React.ComponentType<PopOverFabContentProps<ContentProps>>;
  contentProps?: ContentProps;
  fab: React.ComponentType<FP>;
  popOverDirection?: 'top-right' | 'bottom-right';
}

export function PopOverFab<FP, ContentProps>(
  props: FP & PopOverFabProps<FP, ContentProps>,
) {
  const {
    content: Content,
    fab: Fab,
    popOverDirection = 'bottom-right',
    contentProps,
    ...rest
  } = props;
  const fabProps = rest as unknown as FP;

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();

  const close = useCallback(() => setOpen(false), [setOpen]);

  const handleOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setOpen(true);
      setAnchorEl(event.currentTarget);
    },
    [setOpen, setAnchorEl],
  );

  const anchorOrigin =
    popOverDirection === 'bottom-right'
      ? topItemPopOverTransformsBottomRight.anchorOrigin
      : topItemPopOverTransformsTopRight.anchorOrigin;
  const transformOrigin =
    popOverDirection === 'bottom-right'
      ? topItemPopOverTransformsBottomRight.transformOrigin
      : topItemPopOverTransformsTopRight.transformOrigin;

  return (
    <>
      <Fab {...fabProps} onClick={handleOpen} />
      <Popover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        onClose={close}
      >
        <Content
          {...(contentProps as PopOverFabContentProps<ContentProps>)}
          close={close}
        />
      </Popover>
    </>
  );
}
