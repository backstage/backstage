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

import type { ReactElement, ReactNode, CSSProperties } from 'react';
import type { Responsive, MarginProps } from '../../types';

/** @public */
export type AlertOwnProps = {
  status?: Responsive<'info' | 'success' | 'warning' | 'danger'>;
  icon?: boolean | ReactElement;
  loading?: boolean;
  customActions?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * Properties for {@link Alert}
 *
 * @public
 */
export interface AlertProps extends MarginProps, AlertOwnProps {}
