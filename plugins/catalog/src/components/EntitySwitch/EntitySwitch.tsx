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

import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import React, { PropsWithChildren, ReactNode } from 'react';
import {
  attachComponentData,
  useApiHolder,
  useElementFilter,
  ApiHolder,
} from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';

const ENTITY_SWITCH_KEY = 'core.backstage.entitySwitch';

const EntitySwitchCase = (_: {
  if?: (
    entity: Entity,
    context: { apis: ApiHolder },
  ) => boolean | Promise<boolean>;
  children: ReactNode;
}) => null;

attachComponentData(EntitySwitchCase, ENTITY_SWITCH_KEY, true);

type SwitchCase = {
  if?: (
    entity: Entity,
    context: { apis: ApiHolder },
  ) => boolean | Promise<boolean>;
  children: JSX.Element;
};

type SwitchCaseResult = {
  if: boolean | Promise<boolean>;
  children: JSX.Element;
};

export const EntitySwitch = ({ children }: PropsWithChildren<{}>) => {
  const { entity } = useEntity();
  const apis = useApiHolder();
  const results = useElementFilter(
    children,
    collection =>
      collection
        .selectByComponentData({
          key: ENTITY_SWITCH_KEY,
          withStrictError: 'Child of EntitySwitch is not an EntitySwitch.Case',
        })
        .getElements()
        .flatMap<SwitchCaseResult>((element: React.ReactElement) => {
          const { if: condition, children: elementsChildren } =
            element.props as SwitchCase;
          return [
            {
              if: condition?.(entity, { apis }) ?? true,
              children: elementsChildren,
            },
          ];
        }),
    [apis, entity],
  );
  const hasAsyncCases = results.some(
    r => typeof r.if === 'object' && 'then' in r.if,
  );

  if (hasAsyncCases) {
    return <AsyncEntitySwitch results={results} />;
  }

  return results.find(r => r.if)?.children ?? null;
};

function AsyncEntitySwitch({ results }: { results: SwitchCaseResult[] }) {
  const { loading, value } = useAsync(async () => {
    const promises = results.map(
      async ({ if: condition, children: output }) => {
        try {
          if (await condition) {
            return output;
          }
        } catch {
          /* ignored */
        }

        return null;
      },
    );
    return (await Promise.all(promises)).find(Boolean) ?? null;
  }, [results]);

  if (loading || !value) {
    return null;
  }

  return value;
}

EntitySwitch.Case = EntitySwitchCase;
