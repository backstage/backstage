/*
 * Copyright 2024 The Backstage Authors
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
  CellProps as ReactAriaCellProps,
  ColumnProps as AriaColumnProps,
} from 'react-aria-components';
import type { TextColors } from '../../types';

/** @public */
export interface CellProps extends ReactAriaCellProps {}

/** @public */
export interface CellTextProps extends ReactAriaCellProps {
  title: string;
  description?: string;
  color?: TextColors;
  leadingIcon?: React.ReactNode | null;
  href?: string;
}

/** @public */
export interface CellProfileProps extends ReactAriaCellProps {
  src?: string;
  name?: string;
  href?: string;
  description?: string;
  color?: TextColors;
}

/** @public */
export interface ColumnProps extends Omit<AriaColumnProps, 'children'> {
  children?: React.ReactNode;
}
