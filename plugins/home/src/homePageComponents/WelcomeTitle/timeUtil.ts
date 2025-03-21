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

import goodMorning from './locales/goodMorning.locales.json';
import goodAfternoon from './locales/goodAfternoon.locales.json';
import goodEvening from './locales/goodEvening.locales.json';

// Select a large random integer at startup, to prevent the greetings to change
// every time the user navigates.
const greetingRandomSeed = Math.floor(Math.random() * 1000000);

export function getTimeBasedGreeting(language?: string[]): {
  language: string;
  greeting: string;
} {
  const random = (array: string[]) => array[greetingRandomSeed % array.length];

  const currentHour = new Date(Date.now()).getHours();
  if (currentHour >= 23) {
    return {
      language: 'Seriously',
      greeting: 'Get some rest',
    };
  }

  const timeOfDay = (hour: number): { [language: string]: string } => {
    if (hour < 12) return goodMorning;
    if (hour < 17) return goodAfternoon;
    return goodEvening;
  };

  const greetings = timeOfDay(currentHour);

  if (Array.isArray(language) && language.length > 0) {
    const validLanguages = language.filter(lang => lang && greetings[lang]);
    if (validLanguages.length > 0) {
      const greetingsKey = random(validLanguages);
      return {
        language: greetingsKey,
        greeting: greetings[greetingsKey],
      };
    }
  }

  const greetingsKey = random(Object.keys(greetings));
  return {
    language: greetingsKey,
    greeting: greetings[greetingsKey],
  };
}
