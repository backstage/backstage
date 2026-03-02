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
 * The visual progress of the task event stream
 */
export const TaskBorder = (props: {
  isComplete: boolean;
  isError: boolean;
}) => {
  if (!props.isComplete) {
    // Indeterminate progress bar — animated sliding bar
    return (
      <div
        className="relative h-1 w-full overflow-hidden bg-primary/20"
        role="progressbar"
      >
        <div
          className="absolute inset-0 h-full w-1/3 bg-primary"
          style={{
            animation:
              'backstage-indeterminate 1.5s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite',
          }}
        />
        {/* Keyframe definition for the indeterminate animation */}
        <style>{`
          @keyframes backstage-indeterminate {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}</style>
      </div>
    );
  }

  // Determinate progress bar — full width with success/error color
  return (
    <div
      className="relative h-1 w-full overflow-hidden bg-primary/20"
      role="progressbar"
      aria-valuenow={100}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full w-full transition-all ${
          props.isError ? 'bg-destructive' : 'bg-green-600 dark:bg-green-400'
        }`}
      />
    </div>
  );
};
