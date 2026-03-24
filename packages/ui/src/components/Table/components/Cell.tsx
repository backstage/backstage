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

import { Cell as ReactAriaCell } from 'react-aria-components';
import { useIsHidden } from '@react-aria/collections';
import type { CellProps } from '../types';
import type { ReactNode } from 'react';
import { useDefinition } from '../../../hooks/useDefinition';
import { CellDefinition } from '../definition';

/**
 * Wrapper that suppresses its children during the React Aria collection pass
 * (where they would be rendered into a fake Document that lacks
 * `createElementNS`) and renders them normally in the real DOM pass.
 */
function SafeContent({ children }: { children: ReactNode }) {
  return useIsHidden() ? null : <>{children}</>;
}

/** @public */
const Cell = (props: CellProps) => {
  const { ownProps, restProps } = useDefinition(CellDefinition, props);

  // When `textValue` is provided the collection system already has the
  // accessible text it needs, so we can safely wrap children in a component
  // that skips rendering during the collection pass.  The children are still
  // stored on the collection node (node.rendered) so that the real render
  // pass can display them.
  if (restProps.textValue != null && restProps.children != null) {
    const { children, ...rest } = restProps;
    return (
      <ReactAriaCell className={ownProps.classes.root} {...rest}>
        <SafeContent>{children}</SafeContent>
      </ReactAriaCell>
    );
  }

  return <ReactAriaCell className={ownProps.classes.root} {...restProps} />;
};

Cell.displayName = 'Cell';

export { Cell };
