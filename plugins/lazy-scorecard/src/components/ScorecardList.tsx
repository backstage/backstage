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
import { stringifyEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/frontend-plugin-api';
import { useEffect, useState } from 'react';
import { scorecardApiRef, Scorecard } from '../api';

/** Shared view of a scorecard, used by both the page and the entity tab. */
export function ScorecardView(props: { scorecard: Scorecard }) {
  const { scorecard } = props;
  return (
    <div>
      <div>
        {scorecard.entityRef}: {scorecard.score}%
      </div>
      <ul>
        {scorecard.checks.map(check => (
          <li key={check.name}>
            {check.passed ? 'Pass' : 'Fail'}: {check.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ScorecardList() {
  const api = useApi(scorecardApiRef);
  const [scorecards, setScorecards] = useState<Scorecard[]>();

  useEffect(() => {
    Promise.all(
      [
        { kind: 'component', name: 'example-website' },
        { kind: 'component', name: 'example-service' },
      ].map(({ kind, name }) =>
        api.getScorecard(
          stringifyEntityRef({ kind, namespace: 'default', name }),
        ),
      ),
    ).then(setScorecards);
  }, [api]);

  return (
    <div style={{ padding: 24 }}>
      {scorecards
        ? scorecards.map(s => <ScorecardView key={s.entityRef} scorecard={s} />)
        : 'Loading...'}
    </div>
  );
}
