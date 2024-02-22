/*
 * Copyright 2021 The Backstage Authors
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
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/core-plugin-api';
import { techInsightsApiRef } from '../../api/TechInsightsApi';
import { useEntity } from '@backstage/plugin-catalog-react';
import { getCompoundEntityRef } from '@backstage/catalog-model';
import Fact from './Fact';
import { useMemo } from 'react';
import { List, ListItem } from '@material-ui/core';

export const FactDetails = (props: {
  numerators: string[];
  denominators: string[];
}) => {
  const { numerators, denominators } = props;

  const api = useApi(techInsightsApiRef);
  const { entity } = useEntity();

  const checks = useAsync(async () => await api.getAllChecks(), [api, entity]);

  const factIds: string[] = useMemo(() => {
    return (
      checks.value
        ?.map(check => {
          return check.factIds.flatMap(id => id);
        })
        .flat() || []
    );
  }, [checks]);

  const { value } = useAsync(
    async () => await api.getFacts(getCompoundEntityRef(entity), factIds),
    [api, entity, factIds],
  );

  const components = useMemo(() => {
    if (value) {
      return factIds.map(factId => {
        const comp = [];
        const f = value[factId]?.facts;

        let numeratorName: string | null = null;
        let denominatorName: string | null = null;
        let numerator: number | null = null;
        let denominator: number | null = null;

        for (const [key, val] of Object.entries(f)) {
          if (denominators.includes(key)) {
            denominatorName = key;
            denominator = Number(val);
          }

          if (numerators.includes(key)) {
            numerator = Number(val);
            numeratorName = key;
          }

          if (numerator && denominator) {
            comp.push(
              <Fact
                numerator={numerator}
                denominator={denominator}
                title={`${numeratorName} out of ${denominatorName}`}
              />,
            );
            denominator = null;
            numerator = null;
          }
        }

        return comp;
      });
    }
    return [];
  }, [value, denominators, numerators, factIds]);

  return (
    components && (
      <List>
        {components.map(c => {
          return <ListItem>{c}</ListItem>;
        })}
      </List>
    )
  );
};
