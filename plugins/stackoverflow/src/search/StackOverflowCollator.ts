/*
 * Copyright 2021 Spotify AB
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

import { IndexableDocument, DocumentCollator } from '@backstage/search-common';
import fetch from 'cross-fetch';

export interface StackOverflowDocument extends IndexableDocument {
  answers: number;
  tags: Array<string>
}

export class StackOverflowCollator implements DocumentCollator {
  public readonly type: string = 'stack-overflow';

  async execute() {
    const baseUrl = 'https://api.stackexchange.com/2.2';
    const res = await fetch(`${baseUrl}/questions?order=desc&sort=votes&site=stackoverflow`);
    const data = await res.json();
    return data.items.map(
      // @ts-ignore
      (question): StackOverflowDocument => {
        return {
          title: question.title,
          location: question.link,
          text: question.owner.display_name,
          tags: question.tags,
          answers: question.answer_count
        };
      },
    );
  }
}
