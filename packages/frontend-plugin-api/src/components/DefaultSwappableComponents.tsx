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

import {
  ErrorDisplayProps,
  NotFoundErrorPageProps,
  ProgressProps,
} from '../types';
import { createSwappableComponent } from './createSwappableComponent';

/**
 * @public
 */
export const Progress = createSwappableComponent<ProgressProps>({
  id: 'core-progress',
});

/**
 * @public
 */
export const NotFoundErrorPage =
  createSwappableComponent<NotFoundErrorPageProps>({
    id: 'core-not-found-error-page',
  });

/**
 * @public
 */
export const ErrorDisplay = createSwappableComponent<ErrorDisplayProps>({
  id: 'core-error-display',
  loader: () => props =>
    <div data-testid="core-error-display">{props.error.message}</div>,
});
