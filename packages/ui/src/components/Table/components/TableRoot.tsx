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

import { useRef } from 'react';
import { useDefinition } from '../../../hooks/useDefinition';
import { useIsomorphicLayoutEffect } from '../../../hooks/useIsomorphicLayoutEffect';
import { TableDefinition } from '../definition';
import { Table as ReactAriaTable } from 'react-aria-components';
import { TableRootProps } from '../types';

/**
 * The low-level table root element for building custom table layouts from atomic components.
 * For most use cases, prefer the `Table` convenience wrapper.
 *
 * @public
 */
export const TableRoot = (props: TableRootProps) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    TableDefinition,
    // Merge deprecated `loading` into `isPending` so data attributes and
    // internal logic only need to check a single prop.
    {
      ...props,
      isPending:
        props.isPending || props.loading
          ? true
          : props.isPending ?? props.loading,
    },
  );

  const isBusy = Boolean(ownProps.stale || ownProps.isPending);
  const ref = useRef<HTMLTableElement | HTMLDivElement>(null);

  // React Aria only forwards a fixed set of ARIA attributes to the underlying
  // grid element, and `aria-busy` is not one of them, so apply it directly to
  // the DOM node to expose the loading state to assistive technology.
  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    if (isBusy) {
      element.setAttribute('aria-busy', 'true');
    } else {
      element.removeAttribute('aria-busy');
    }
  }, [isBusy]);

  return (
    <ReactAriaTable
      ref={ref}
      className={ownProps.classes.root}
      aria-label="Data table"
      {...dataAttributes}
      {...restProps}
    />
  );
};
