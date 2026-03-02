/*
 * Copyright 2023 The Backstage Authors
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

/**
 * The visual progress of the task event stream.
 *
 * Renders an indeterminate sliding progress bar when the task is running,
 * or a full-width determinate bar with success/error coloring when complete.
 *
 * Uses semantic CSS custom property tokens (`--status-ok`, `--destructive`)
 * defined in the global token system for theme-aware coloring.
 * The `backstage-indeterminate` keyframe animation is defined in
 * `packages/core-components/src/styles/globals.css`.
 */
export const TaskBorder = (props: {
  isComplete: boolean;
  isError: boolean;
}) => {
  if (!props.isComplete) {
    // Indeterminate progress bar — animated sliding bar using global keyframe
    return (
      <div
        className="relative h-1 w-full overflow-hidden bg-primary/20"
        role="progressbar"
        data-testid="task-border-indeterminate"
      >
        <div
          className="absolute inset-0 h-full w-1/3 bg-primary"
          style={{
            animation:
              'backstage-indeterminate 1.5s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite',
          }}
        />
      </div>
    );
  }

  // Determinate progress bar — full width with success/error semantic token
  return (
    <div
      className="relative h-1 w-full overflow-hidden bg-primary/20"
      role="progressbar"
      aria-valuenow={100}
      aria-valuemin={0}
      aria-valuemax={100}
      data-testid="task-border-determinate"
    >
      <div
        className="h-full w-full transition-all"
        style={{
          backgroundColor: props.isError
            ? 'var(--destructive)'
            : 'var(--status-ok)',
        }}
      />
    </div>
  );
};
