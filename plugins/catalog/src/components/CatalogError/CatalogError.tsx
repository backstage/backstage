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
import React from 'react';
import { CodeSnippet, WarningPanel } from '@backstage/core-components';

/**
 * Props for {@link CatalogError}.
 *
 * @public
 */
export interface CatalogErrorProps {
  error: Error;
}

/** @public */
export const CatalogError = (props: CatalogErrorProps) => {
  return (
    <div>
      <WarningPanel severity="error" title="Could not fetch catalog entities.">
        <CodeSnippet language="text" text={props.error.toString()} />
      </WarningPanel>
    </div>
  );
};
