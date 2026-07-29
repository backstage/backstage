/*
 * Copyright 2020 The Backstage Authors
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

import { Suspense, lazy } from 'react';
import type { CodeSnippetProps } from './CodeSnippetContent';

export type { CodeSnippetProps } from './CodeSnippetContent';

const LazyCodeSnippetContent = lazy(() =>
  import('./CodeSnippetContent').then(m => ({ default: m.CodeSnippet })),
);

/**
 * Thin wrapper on top of {@link https://react-syntax-highlighter.github.io/react-syntax-highlighter/ | react-syntax-highlighter}
 * providing consistent theming and copy code button
 *
 * @public
 */
export function CodeSnippet(props: CodeSnippetProps) {
  return (
    <Suspense fallback={<div />}>
      <LazyCodeSnippetContent {...props} />
    </Suspense>
  );
}
