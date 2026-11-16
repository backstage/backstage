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

import type { Joke } from './Context';

export const fallbackJokes: Joke[] = [
  {
    setup: 'Why did the joke fail to load?',
    punchline: "It couldn't find its way out of the backstage.",
  },
  {
    setup: 'I tried to fetch you a joke from the internet.',
    punchline: "It didn't get the joke either.",
  },
  {
    setup: "Knock, knock. Who's there?",
    punchline: 'Not the joke service, apparently. Try the reroll button.',
  },
  {
    setup: "What's the difference between this joke and a 503?",
    punchline: 'This one still arrived.',
  },
];

export const randomFallbackJoke = (): Joke =>
  fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
