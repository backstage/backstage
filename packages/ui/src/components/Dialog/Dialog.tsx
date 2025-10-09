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
  DialogCloseProps,
} from './types';
import './Dialog.styles.css';
import { RiCloseLine } from '@remixicon/react';
import { ScrollArea } from '../ScrollArea';
import { Button } from '../Button';

/** @public */
export const DialogTrigger = (props: DialogTriggerProps) => {
  return <RADialogTrigger {...props} />;
};

/** @public */
export const DialogHeader = forwardRef<
  React.ElementRef<'div'>,
  DialogHeaderProps
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={clsx('bui-DialogHeader', className)} {...props}>
    <Heading slot="title" className="bui-DialogHeaderTitle">
      {children}
    </Heading>
    <Button variant="tertiary" className="bui-DialogHeaderClose" slot="close">
      <RiCloseLine />
    </Button>
  </div>
));
DialogHeader.displayName = 'DialogHeader';

/** @public */
export const DialogBody = forwardRef<React.ElementRef<'div'>, DialogBodyProps>(
  ({ className, children, height, ...props }, ref) => (
    <ScrollArea.Root
      className={clsx('bui-DialogBody', className)}
      style={{
        height: height
          ? typeof height === 'number'
            ? `${height}px`
            : height
          : undefined,
      }}
      ref={ref}
      {...props}
    >
      <ScrollArea.Viewport>{children}</ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  ),
);
DialogBody.displayName = 'DialogBody';

/** @public */
export const DialogFooter = forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={clsx('bui-DialogFooter', className)} {...props}>
    {children}
  </div>
));
DialogFooter.displayName = 'DialogFooter';

/** @public */
export const DialogClose = forwardRef<
  React.ElementRef<typeof Button>,
  DialogCloseProps
>(({ className, variant = 'secondary', children, ...props }, ref) => (
  <Button
    ref={ref}
    slot="close"
    variant={variant}
    className={clsx('bui-DialogClose', className)}
    {...props}
  >
    {children}
  </Button>
));
DialogClose.displayName = 'DialogClose';

/** @public */
export const Dialog = forwardRef<React.ElementRef<typeof Modal>, DialogProps>(
  ({ className, children, ...props }, ref) => (
    <Modal
      ref={ref}
      className={clsx('bui-Dialog', className)}
      isDismissable
      isKeyboardDismissDisabled={false}
      {...props}
    >
      <RADialog className="bui-DialogContent">{children}</RADialog>
    </Modal>
  ),
);
Dialog.displayName = 'Dialog';
