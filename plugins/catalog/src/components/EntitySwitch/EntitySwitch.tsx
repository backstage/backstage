/*
 * Copyright 2020 Spotify AB
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
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  Children,
  Fragment,
  isValidElement,
  PropsWithChildren,
  ReactNode,
  useMemo,
} from 'react';

const EntitySwitchCase = (_: {
  if?: (entity: Entity) => boolean;
  children: ReactNode;
}) => null;

type SwitchCase = {
  if?: (entity: Entity) => boolean;
  children: JSX.Element;
};

function createSwitchCasesFromChildren(childrenNode: ReactNode): SwitchCase[] {
  return Children.toArray(childrenNode).flatMap(child => {
    if (!isValidElement(child)) {
      return [];
    }

    if (child.type === Fragment) {
      return createSwitchCasesFromChildren(child.props.children);
    }

    if (child.type !== EntitySwitchCase) {
      throw new Error(`Child of EntitySwitch is not an EntitySwitch.Case`);
    }

    const { if: condition, children } = child.props;
    return [{ if: condition, children }];
  });
}

export const EntitySwitch = ({ children }: PropsWithChildren<{}>) => {
  const { entity } = useEntity();
  const switchCases = useMemo(() => createSwitchCasesFromChildren(children), [
    children,
  ]);

  const matchingCase = switchCases.find(switchCase =>
    switchCase.if ? switchCase.if(entity) : true,
  );
  return matchingCase?.children ?? null;
};

EntitySwitch.Case = EntitySwitchCase;
