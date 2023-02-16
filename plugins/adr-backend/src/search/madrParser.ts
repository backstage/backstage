/*
 * Copyright 2023 The Backstage Authors
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

import { DateTime } from 'luxon';
import { marked } from 'marked';
import { MADR_DATE_FORMAT } from '@backstage/plugin-adr-common';

export const madrParser = (content: string, dateFormat = MADR_DATE_FORMAT) => {
  const tokens = marked.lexer(content);
  if (!tokens.length) {
    throw new Error('ADR has no content');
  }

  // First h1 header should contain ADR title
  const adrTitle = (
    tokens.find(
      t => t.type === 'heading' && t.depth === 1,
    ) as marked.Tokens.Heading
  )?.text;

  // First list should contain status & date metadata (if defined)
  const listTokens = (tokens.find(t => t.type === 'list') as marked.Tokens.List)
    ?.items;
  const adrStatus = listTokens
    ?.find(t => /^status:/i.test(t.text))
    ?.text.replace(/^status:/i, '')
    .trim()
    .toLocaleLowerCase('en-US');

  const adrDateTime = DateTime.fromFormat(
    listTokens
      ?.find(t => /^date:/i.test(t.text))
      ?.text.replace(/^date:/i, '')
      .trim() ?? '',
    dateFormat,
  );
  const adrDate = adrDateTime?.isValid
    ? adrDateTime.toFormat(MADR_DATE_FORMAT)
    : undefined;

  return {
    title: adrTitle,
    status: adrStatus,
    date: adrDate,
  };
};
