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
import { useAsyncEntity } from '@backstage/plugin-catalog-react';
import React, { ReactNode, ReactElement } from 'react';
import {
  attachComponentData,
  useApiHolder,
  useElementFilter,
  ApiHolder,
} from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';

const ENTITY_SWITCH_KEY = 'core.backstage.entitySwitch';

/** @public */
export interface EntitySwitchCaseProps {
  if?: (
    entity: Entity,
    context: { apis: ApiHolder },
  ) => boolean | Promise<boolean>;
  children: ReactNode;
}

const EntitySwitchCaseComponent = (_props: EntitySwitchCaseProps) => null;

attachComponentData(EntitySwitchCaseComponent, ENTITY_SWITCH_KEY, true);

interface EntitySwitchCase {
  if?: (
    entity: Entity,
    context: { apis: ApiHolder },
  ) => boolean | Promise<boolean>;
  children: JSX.Element;
}

type SwitchCaseResult = {
  if?: boolean | Promise<boolean>;
  children: JSX.Element;
};

/**
 * Props for the {@link EntitySwitch} component.
 * @public
 */
export interface EntitySwitchProps {
  children: ReactNode;
  renderMultipleMatches?: 'first' | 'all';
}

/** @public */
export const EntitySwitch = (props: EntitySwitchProps) => {
  const { entity, loading } = useAsyncEntity();
  const apis = useApiHolder();
  const results = useElementFilter(
    props.children,
    collection =>
      collection
        .selectByComponentData({
          key: ENTITY_SWITCH_KEY,
          withStrictError: 'Child of EntitySwitch is not an EntitySwitch.Case',
        })
        .getElements()
        .flatMap<SwitchCaseResult>((element: ReactElement) => {
          // Nothing is rendered while loading
          if (loading) {
            return [];
          }

          const { if: condition, children: elementsChildren } =
            element.props as EntitySwitchCase;

          // If the entity is missing or there is an error, render the default page
          if (!entity) {
            return [
              {
                if: condition === undefined,
                children: elementsChildren,
              },
            ];
          }
          return [
            {
              if: condition?.(entity, { apis }),
              children: elementsChildren,
            },
          ];
        }),
    [apis, entity, loading],
  );

  const hasAsyncCases = results.some(
    r => typeof r.if === 'object' && 'then' in r.if,
  );

  if (hasAsyncCases) {
    return (
      <AsyncEntitySwitch
        results={results}
        renderMultipleMatches={props.renderMultipleMatches}
      />
    );
  }

  if (props.renderMultipleMatches === 'all') {
    const children = results.filter(r => r.if).map(r => r.children);
    if (children.length === 0) {
      return getDefaultChildren(results);
    }
    return <>{children}</>;
  }

  return results.find(r => r.if)?.children ?? getDefaultChildren(results);
};

function AsyncEntitySwitch({
  results,
  renderMultipleMatches,
}: {
  results: SwitchCaseResult[];
  renderMultipleMatches?: 'first' | 'all';
}) {
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

    if (renderMultipleMatches === 'all') {
      const children = (await Promise.all(promises)).filter(Boolean);
      if (children.length === 0) {
        return getDefaultChildren(results);
      }
      return <>{children}</>;
    }

    return (
      (await Promise.all(promises)).find(Boolean) ?? getDefaultChildren(results)
    );
  }, [results]);

  if (loading || !value) {
    return null;
  }

  return value;
}

function getDefaultChildren(results: SwitchCaseResult[]) {
  return results.filter(r => r.if === undefined)[0].children ?? null;
}

EntitySwitch.Case = EntitySwitchCaseComponent;
