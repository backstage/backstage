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
import { Scorecard, getScorecard } from '../api';

const ENTITY_REFS = [
  'component:default/example-website',
  'component:default/example-service',
];

/** Shared view of a scorecard, used by both sub-pages. */
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
  return (
    <div style={{ padding: 24 }}>
      {ENTITY_REFS.map(ref => (
        <ScorecardView key={ref} scorecard={getScorecard(ref)} />
      ))}
    </div>
  );
}
