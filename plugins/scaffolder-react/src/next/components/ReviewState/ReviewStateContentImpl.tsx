/*
 * Copyright 2026 The Backstage Authors
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
import { StructuredMetadataTable } from '@backstage/core-components';
import { ReviewStateContentProps } from './ReviewStateContent';

export function ReviewStateContentImpl({ items }: ReviewStateContentProps) {
  // Preserve the native ordering and last-value-wins behavior for duplicate labels.
  const metadata = Object.fromEntries(
    items.map(item => [item.label, item.displayValue]),
  );
  return (
    <StructuredMetadataTable
      metadata={metadata}
      options={{ titleFormat: key => key }}
    />
  );
}
