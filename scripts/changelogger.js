/*
 * Copyright 2022 The Backstage Authors
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

// eslint-disable-next-line import/no-extraneous-dependencies
const fetch = require('node-fetch');

async function main() {
  const url = new URL('http://localhost:7007/api/catalog/events');

  let offset = undefined;
  for (;;) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (offset) {
      url.searchParams.set('offset', offset);
    }
    console.log(`Fetching events at offset ${offset}`);
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Failed to fetch events:', res.statusText);
      continue;
    }

    const { items: events } = await res.json();
    console.log(`Received events: ${JSON.stringify(events, null, 2)}`);

    if (events.length) {
      offset = events[events.length - 1].offset;
    }
  }
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
