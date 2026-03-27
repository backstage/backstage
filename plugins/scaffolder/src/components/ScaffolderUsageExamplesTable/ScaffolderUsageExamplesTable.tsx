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
import { CodeSnippet, MarkdownContent } from '@backstage/core-components';
import { ScaffolderUsageExample } from '@backstage/plugin-scaffolder-react';
import { Fragment } from 'react';

export const ScaffolderUsageExamplesTable = (props: {
  examples: ScaffolderUsageExample[];
}) => {
  return (
    <div data-testid="examples" className="grid grid-cols-12">
      {props.examples.map((example, index) => {
        return (
          <Fragment key={`example-${index}`}>
            <div
              data-testid={`example_desc${index}`}
              className="col-span-12 lg:col-span-3"
            >
              <div className="p-2 overflow-x-auto">
                {example.description && (
                  <MarkdownContent content={example.description} />
                )}
                {example.notes?.length && (
                  <MarkdownContent content={example.notes} />
                )}
              </div>
            </div>
            <div
              data-testid={`example_code${index}`}
              className="col-span-12 lg:col-span-9"
            >
              <div className="p-2">
                <CodeSnippet
                  text={example.example?.trim()}
                  showLineNumbers
                  showCopyCodeButton
                  language="yaml"
                />
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};
