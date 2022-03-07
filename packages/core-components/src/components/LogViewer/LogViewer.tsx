/*
 * Copyright 2021 The Backstage Authors
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

import React, { lazy, Suspense } from 'react';
import { useApp } from '@backstage/core-plugin-api';

const RealLogViewer = lazy(() =>
  import('./RealLogViewer').then(m => ({ default: m.RealLogViewer })),
);

/**
 * The properties for the LogViewer component.
 *
 * @public
 */
export interface LogViewerProps {
  /**
   * The text of the logs to display.
   *
   * The LogViewer component is optimized for appending content at the end of the text.
   */
  text: string;
  /**
   * Styling overrides for classes within the LogViewer component.
   */
  classes?: {
    root?: string;
  };
}

/**
 * A component that displays logs in a scrollable text area.
 *
 * The LogViewer has support for search and filtering, as well as displaying
 * text content with ANSI color escape codes.
 *
 * Since the LogViewer uses windowing to avoid rendering all contents at once, the
 * log is sized automatically to fill the available vertical space. This means
 * it may often be needed to wrap the LogViewer in a container that provides it
 * with a fixed amount of space.
 *
 * @public
 */
export function LogViewer(props: LogViewerProps) {
  const { Progress } = useApp().getComponents();
  return (
    <Suspense fallback={<Progress />}>
      <RealLogViewer {...props} />
    </Suspense>
  );
}
