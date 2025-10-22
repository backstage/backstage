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

import type {
  DialogTriggerProps as RADialogTriggerProps,
  ModalOverlayProps as RAModalProps,
  HeadingProps as RAHeadingProps,
} from 'react-aria-components';

/**
 * Props for the DialogTrigger component.
 * @public
 */
export interface DialogTriggerProps extends RADialogTriggerProps {}

/**
 * Props for the Dialog component.
 * @public
 */
export interface DialogProps extends RAModalProps {
  className?: string;
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
}

/**
 * Props for the DialogHeader component.
 * @public
 */
export interface DialogHeaderProps extends RAHeadingProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Props for the DialogBody component.
 * @public
 */
export interface DialogBodyProps {
  children?: React.ReactNode;
  className?: string;
}
