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
import { useMemo } from 'react';

const ROW_COUNT = 2000;

function buildRows() {
  return Array.from({ length: ROW_COUNT }, (_, i) => ({
    id: i + 1,
    name: `component-${(i * 7919) % 10007}`,
    owner: `team-${i % 37}`,
    score: Math.round(Math.abs(Math.sin(i)) * 1000) / 10,
  }));
}

/** A deliberately chunky page, to make the deferred bundle visible. */
export function HeavyPage() {
  const rows = useMemo(buildRows, []);
  const average = rows.reduce((sum, r) => sum + r.score, 0) / rows.length;

  return (
    <div style={{ padding: 24 }}>
      <h1>Lazy Demo</h1>
      <div>
        This page was loaded on demand. {rows.length} rows, average score{' '}
        {average.toFixed(1)}.
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Owner</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.owner}</td>
              <td>{row.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
