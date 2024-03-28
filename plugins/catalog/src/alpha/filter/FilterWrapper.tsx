/*
 * Copyright 2024 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import Grid from '@material-ui/core/Grid';
import React, { useMemo } from 'react';
import { parseFilterExpression } from './parseFilterExpression';

// Keeps track of what filter expression strings that we've seen duplicates of
// with functions, or which emitted parsing errors for so far
const seenParseErrorExpressionStrings = new Set<string>();
const seenDuplicateExpressionStrings = new Set<string>();

// Given an optional filter function and an optional filter expression, make
// sure that at most one of them was given, and return a filter function that
// does the right thing.
export function buildFilterFn(
  filterFunction?: (entity: Entity) => boolean,
  filterExpression?: string,
): (entity: Entity) => boolean {
  if (
    filterFunction &&
    filterExpression &&
    !seenDuplicateExpressionStrings.has(filterExpression)
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      `Duplicate entity filter methods found, both '${filterExpression}' as well as a callback function, which is not permitted - using the callback`,
    );
    seenDuplicateExpressionStrings.add(filterExpression);
  }

  const filter = filterFunction || filterExpression;
  if (!filter) {
    return () => true;
  } else if (typeof filter === 'function') {
    return subject => filter(subject);
  }

  const result = parseFilterExpression(filter);
  if (
    result.expressionParseErrors.length &&
    !seenParseErrorExpressionStrings.has(filter)
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      `Error(s) in entity filter expression '${filter}'`,
      result.expressionParseErrors,
    );
    seenParseErrorExpressionStrings.add(filter);
  }

  return result.filterFn;
}

// Handles the memoized parsing of filter expressions
export function FilterWrapper(props: {
  entity: Entity;
  element: React.JSX.Element;
  filterFunction?: (entity: Entity) => boolean;
  filterExpression?: string;
}) {
  const { entity, element, filterFunction, filterExpression } = props;

  const filterFn = useMemo(
    () => buildFilterFn(filterFunction, filterExpression),
    [filterFunction, filterExpression],
  );

  return filterFn(entity) ? (
    <Grid item md={6} xs={12}>
      {element}
    </Grid>
  ) : null;
}
