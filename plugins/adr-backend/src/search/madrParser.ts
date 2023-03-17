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

const getTitle = (tokens: marked.TokensList): string | undefined => {
  return (
    tokens.find(
      t => t.type === 'heading' && t.depth === 1,
    ) as marked.Tokens.Heading
  )?.text;
};

const getStatusForV3Format = (tokens: marked.TokensList): string | undefined =>
  (
    tokens.find(
      t =>
        t.type === 'heading' &&
        t.depth === 2 &&
        t.text.toLowerCase().includes('status:'),
    ) as marked.Tokens.Text
  )?.text
    .toLowerCase()
    .split('\n')
    .find(l => /^status:/.test(l))
    ?.replace(/^status:/i, '')
    .trim()
    .toLocaleLowerCase('en-US');

const getStatusForV2Format = (tokens: marked.TokensList): string | undefined =>
  (tokens.find(t => t.type === 'list') as marked.Tokens.List)?.items
    ?.find(t => /^status:/i.test(t.text))
    ?.text.replace(/^status:/i, '')
    .trim()
    .toLocaleLowerCase('en-US');

const getDateForV3Format = (
  tokens: marked.TokensList,
  dateFormat: string,
): string | undefined => {
  let adrDateTime: DateTime | undefined;
  const dateLine = (
    tokens.find(
      t =>
        t.type === 'heading' &&
        t.depth === 2 &&
        t.text.toLowerCase().includes('date:'),
    ) as marked.Tokens.Text
  )?.text
    .toLowerCase()
    .split('\n')
    .find(l => /^date:/.test(l));

  if (dateLine) {
    adrDateTime = DateTime.fromFormat(
      dateLine.replace(/^date:/i, '').trim(),
      dateFormat,
    );
  }
  return adrDateTime?.isValid
    ? adrDateTime.toFormat(MADR_DATE_FORMAT)
    : undefined;
};

const getDateForV2Format = (
  tokens: marked.TokensList,
  dateFormat: string,
): string | undefined => {
  const listTokens = (tokens.find(t => t.type === 'list') as marked.Tokens.List)
    ?.items;
  const adrDateTime = DateTime.fromFormat(
    listTokens
      ?.find(t => /^date:/i.test(t.text))
      ?.text.replace(/^date:/i, '')
      .trim() ?? '',
    dateFormat,
  );
  return adrDateTime?.isValid
    ? adrDateTime.toFormat(MADR_DATE_FORMAT)
    : undefined;
};

const getStatus = (tokens: marked.TokensList): string | undefined => {
  return getStatusForV3Format(tokens) ?? getStatusForV2Format(tokens);
};
const getDate = (
  tokens: marked.TokensList,
  dateFormat: string,
): string | undefined =>
  getDateForV3Format(tokens, dateFormat) ??
  getDateForV2Format(tokens, dateFormat);

export const madrParser = (content: string, dateFormat = MADR_DATE_FORMAT) => {
  const tokens = marked.lexer(content);
  if (!tokens.length) {
    throw new Error('ADR has no content');
  }

  return {
    title: getTitle(tokens),
    status: getStatus(tokens),
    date: getDate(tokens, dateFormat),
  };
};
