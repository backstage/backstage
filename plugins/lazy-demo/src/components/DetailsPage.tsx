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
import { useRouteRef } from '@backstage/frontend-plugin-api';
import { Link } from 'react-router-dom';
import { rootRouteRef } from '../routes';

export function DetailsPage() {
  const rootLink = useRouteRef(rootRouteRef);

  return (
    <div style={{ padding: 24 }}>
      <h1>Lazy Demo Details</h1>
      {rootLink ? <Link to={rootLink()}>Back to the lazy demo</Link> : null}
    </div>
  );
}
