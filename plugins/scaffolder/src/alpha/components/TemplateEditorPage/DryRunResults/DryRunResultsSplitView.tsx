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

import { Children, ReactNode } from 'react';
import { Separator } from '@backstage/core-components';

/**
 * A reusable two-pane split view layout rendered as a CSS grid with a fixed
 * 280 px left pane, a visual separator, and a fluid right pane (3 fr).
 *
 * Exactly two children must be provided — the first is placed in the
 * narrow left pane (e.g. a file tree) and the second fills the wider
 * right pane (e.g. file content preview). Both panes scroll independently.
 *
 * @public
 */
export function DryRunResultsSplitView(props: { children: ReactNode }) {
  const childArray = Children.toArray(props.children);

  if (childArray.length !== 2) {
    throw new Error('must have exactly 2 children');
  }

  return (
    <div className="grid grid-cols-[280px_auto_3fr] grid-rows-[1fr]">
      <div className="overflow-y-auto h-full min-h-0 bg-card">
        {childArray[0]}
      </div>
      <Separator orientation="vertical" />
      <div className="overflow-y-auto h-full min-h-0">{childArray[1]}</div>
    </div>
  );
}
