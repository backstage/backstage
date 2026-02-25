/*
 * Copyright 2025 The Backstage Authors
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

import { forwardRef } from 'react';
import {
  Dialog as RADialog,
  DialogTrigger as RADialogTrigger,
  Modal,
  Heading,
} from 'react-aria-components';
import type {
  DialogTriggerProps,
  DialogHeaderProps,
  DialogProps,
  DialogBodyProps,
  DialogFooterProps,
} from './types';
import { RiCloseLine } from '@remixicon/react';
import { Button } from '../Button';
import { useDefinition } from '../../hooks/useDefinition';
import {
  DialogDefinition,
  DialogHeaderDefinition,
  DialogBodyDefinition,
  DialogFooterDefinition,
} from './definition';
import { Box } from '../Box';
import { BgReset } from '../../hooks/useBg';
import { Flex } from '../Flex';

/** @public */
export const DialogTrigger = (props: DialogTriggerProps) => {
  return <RADialogTrigger {...props} />;
};

/** @public */
export const Dialog = forwardRef<React.ElementRef<typeof Modal>, DialogProps>(
  (props, ref) => {
    const { ownProps, restProps } = useDefinition(DialogDefinition, props, {
      classNameTarget: 'dialog',
    });
    const { classes, children, width, height, style } = ownProps;

    return (
      <Modal
        ref={ref}
        className={classes.root}
        isDismissable
        isKeyboardDismissDisabled={false}
        {...restProps}
      >
        <RADialog
          className={classes.dialog}
          style={{
            ['--bui-dialog-min-width' as keyof React.CSSProperties]:
              typeof width === 'number' ? `${width}px` : width || '400px',
            ['--bui-dialog-min-height' as keyof React.CSSProperties]: height
              ? typeof height === 'number'
                ? `${height}px`
                : height
              : 'auto',
            ...style,
          }}
        >
          <BgReset>
            <Box bg="neutral" className={classes.content}>
              {children}
            </Box>
          </BgReset>
        </RADialog>
      </Modal>
    );
  },
);

Dialog.displayName = 'Dialog';

/** @public */
export const DialogHeader = forwardRef<
  React.ElementRef<'div'>,
  DialogHeaderProps
>((props, ref) => {
  const { ownProps, restProps } = useDefinition(DialogHeaderDefinition, props);
  const { classes, children } = ownProps;

  return (
    <Flex ref={ref} className={classes.root} {...restProps}>
      <Heading slot="title" className={classes.title}>
        {children}
      </Heading>
      <Button name="close" aria-label="Close" variant="tertiary" slot="close">
        <RiCloseLine />
      </Button>
    </Flex>
  );
});
DialogHeader.displayName = 'DialogHeader';

/** @public */
export const DialogBody = forwardRef<React.ElementRef<'div'>, DialogBodyProps>(
  (props, ref) => {
    const { ownProps, restProps } = useDefinition(DialogBodyDefinition, props);
    const { classes, children } = ownProps;

    return (
      <div className={classes.root} ref={ref} {...restProps}>
        {children}
      </div>
    );
  },
);

DialogBody.displayName = 'DialogBody';

/** @public */
export const DialogFooter = forwardRef<
  React.ElementRef<'div'>,
  DialogFooterProps
>((props, ref) => {
  const { ownProps, restProps } = useDefinition(DialogFooterDefinition, props);
  const { classes, children } = ownProps;

  return (
    <div ref={ref} className={classes.root} {...restProps}>
      {children}
    </div>
  );
});
DialogFooter.displayName = 'DialogFooter';
