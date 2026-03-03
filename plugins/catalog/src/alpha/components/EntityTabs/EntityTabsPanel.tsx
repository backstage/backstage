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

import { PropsWithChildren } from 'react';
import { cn } from '@backstage/core-components';

/** @public */
export type EntityTabsPanelClassKey = 'root' | 'stretch' | 'noPadding';

type EntityTabsPanelProps = PropsWithChildren<{
  stretch?: boolean;
  noPadding?: boolean;
  className?: string;
}>;

export function EntityTabsPanel(props: EntityTabsPanelProps) {
  const { className, stretch, noPadding, children, ...restProps } = props;

  return (
    <article
      {...restProps}
      className={cn(
        '[grid-area:pageContent] min-w-0 pt-6 pb-6 px-4 sm:px-6',
        stretch && 'flex flex-col flex-grow',
        noPadding && '!p-0',
        className,
      )}
    >
      {children}
    </article>
  );
}
