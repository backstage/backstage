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
import { Suspense } from 'react';
import { ReviewStateContentImpl } from './ReviewStateContentImpl';
import {
  createSwappableComponent,
  SwappableComponentRef,
} from '@backstage/frontend-plugin-api';

/** Detached JSON values prepared by the native review logic. @alpha */
export type ReviewDisplayValue =
  | string
  | number
  | boolean
  | null
  | readonly ReviewDisplayValue[]
  | { readonly [key: string]: ReviewDisplayValue | undefined };

/** A visible review item. Excluded items are never supplied. @alpha */
export type ReviewItem = Readonly<{
  /** RFC 6901 JSON Pointer identifying the field in submission state. */
  path: string;
  label: string;
  displayValue: ReviewDisplayValue | undefined;
  presentation: 'value' | 'masked';
  /** Field extension name, when available for a non-masked value. */
  fieldType?: string;
}>;

/** Presentation only: no form state, schema, secrets or wizard handlers. @alpha */
export type ReviewStateContentProps = Readonly<{
  items: readonly ReviewItem[];
}>;

const SwappableReviewStateContent =
  createSwappableComponent<ReviewStateContentProps>({
    id: 'scaffolder.reviewStateContent',
    loader: () => ReviewStateContentImpl,
  });

/**
 * Presentation of values already prepared by the native review logic.
 * The default implementation preserves the existing metadata table.
 * Apps using the new frontend system can replace it with a
 * `SwappableComponentBlueprint` registered in an `app` frontend module.
 * Its zero-argument loader returns the replacement component. That component
 * receives only visible, prepared review items as props. Replacements should
 * preserve masked values and use the supplied field path and type for formatting.
 * It does not expose submission state or wizard controls.
 *
 * @example
 * ```tsx
 * SwappableComponentBlueprint.make({
 *   name: 'review-content',
 *   params: defineParams => defineParams({
 *     component: ReviewStateContent,
 *     loader: () => CustomReviewContent,
 *   }),
 * });
 * ```
 * @alpha
 */
export const ReviewStateContent: {
  (props: ReviewStateContentProps): JSX.Element | null;
  ref: SwappableComponentRef<ReviewStateContentProps, ReviewStateContentProps>;
} = Object.assign(
  (props: ReviewStateContentProps) => (
    <Suspense fallback={<ReviewStateContentImpl {...props} />}>
      <SwappableReviewStateContent {...props} />
    </Suspense>
  ),
  { ref: SwappableReviewStateContent.ref },
);
