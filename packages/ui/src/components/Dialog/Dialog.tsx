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
import clsx from 'clsx';
import type {
  DialogTriggerProps,
  DialogHeaderProps,
  DialogProps,
  DialogBodyProps,
} from './types';
import { RiCloseLine } from '@remixicon/react';
import { Button } from '../Button';
import { useStyles } from '../../hooks/useStyles';
import { DialogDefinition } from './definition';
import { Flex } from '../Flex';
import styles from './Dialog.module.css';

/** @public */
export const DialogTrigger = (props: DialogTriggerProps) => {
  return <RADialogTrigger {...props} />;
};

/** @public */
export const Dialog = forwardRef<React.ElementRef<typeof Modal>, DialogProps>(
  (props, ref) => {
    const { classNames, cleanedProps } = useStyles(DialogDefinition, props);
    const { className, children, width, height, style, ...rest } = cleanedProps;

    return (
      <Modal
        ref={ref}
        className={clsx(classNames.overlay, styles[classNames.overlay])}
        isDismissable
        isKeyboardDismissDisabled={false}
        {...rest}
      >
        <RADialog
          className={clsx(
            classNames.dialog,
            styles[classNames.dialog],
            className,
          )}
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
          {children}
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
  const { classNames, cleanedProps } = useStyles(DialogDefinition, props);
  const { className, children, ...rest } = cleanedProps;

  return (
    <Flex
      ref={ref}
      className={clsx(classNames.header, styles[classNames.header], className)}
      {...rest}
    >
      <Heading
        slot="title"
        className={clsx(classNames.headerTitle, styles[classNames.headerTitle])}
      >
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
    const { classNames, cleanedProps } = useStyles(DialogDefinition, props);
    const { className, children, ...rest } = cleanedProps;

    return (
      <div
        className={clsx(classNames.body, styles[classNames.body], className)}
        ref={ref}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

DialogBody.displayName = 'DialogBody';

/** @public */
export const DialogFooter = forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>((props, ref) => {
  const { classNames, cleanedProps } = useStyles(DialogDefinition, props);
  const { className, children, ...rest } = cleanedProps;

  return (
    <div
      ref={ref}
      className={clsx(classNames.footer, styles[classNames.footer], className)}
      {...rest}
    >
      {children}
    </div>
  );
});
DialogFooter.displayName = 'DialogFooter';
