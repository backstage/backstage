/*
 * Copyright 2024 The Backstage Authors
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

import { Response } from 'express';
import { EntitiesResponseItems } from '../../catalog/types';
import { createDeferred, DeferredPromise, JsonValue } from '@backstage/types';
import { NotFoundError } from '@backstage/errors';
import { processEntitiesResponseItems } from './process';

const JSON_CONTENT_TYPE = 'application/json; charset=utf-8';

export function writeSingleEntityResponse(
  res: Response,
  response: EntitiesResponseItems,
  notFoundMessage: string,
) {
  if (response.type === 'object') {
    if (!response.entities[0]) {
      throw new NotFoundError(notFoundMessage);
    }

    res.json(response.entities[0]);
  } else {
    if (!response.entities[0]) {
      throw new NotFoundError(notFoundMessage);
    }

    res.setHeader('Content-Type', JSON_CONTENT_TYPE);
    res.end(response.entities[0]);
  }
}

export async function writeEntitiesResponse(options: {
  res: Response;
  items: EntitiesResponseItems;
  responseWrapper?: (entities: JsonValue) => JsonValue;
  alwaysUseObjectMode?: boolean;
}) {
  const { res, responseWrapper, alwaysUseObjectMode } = options;
  const writer = createResponseDataWriter(res);

  const items = alwaysUseObjectMode
    ? processEntitiesResponseItems(options.items, e => e)
    : options.items;

  if (items.type === 'object') {
    res.json(
      responseWrapper ? responseWrapper?.(items.entities) : items.entities,
    );
    return;
  }

  res.setHeader('Content-Type', JSON_CONTENT_TYPE);

  // responseWrapper allows the caller to render the entities within an object
  let trailing = '';
  if (responseWrapper) {
    const marker = `__MARKER_${Math.random().toString(36).slice(2, 10)}__`;
    const wrapped = JSON.stringify(responseWrapper(marker));
    const parts = wrapped.split(`"${marker}"`);
    if (parts.length !== 2) {
      throw new Error(
        `Entity items response was incorrectly wrapped into ${parts.length} different parts`,
      );
    }
    res.write(parts[0], 'utf8');
    trailing = parts[1];
  }

  let first = true;
  for (const entity of items.entities) {
    const prefix = first ? '[' : ',';
    first = false;

    if ((await writer(prefix + entity)) === 'closed') {
      return;
    }
  }
  res.end(`${first ? '[' : ''}]${trailing}`);
}

/**
 * Creates a data writer that writes to the response and waits if the response
 * buffer needs draining.
 *
 * @internal
 * @returns A writer function. If a write attempt returns 'closed', the
 * connection has become closed prematurely and the caller should stop trying to
 * write.
 */
export function createResponseDataWriter(
  res: Response,
): (data: string | Buffer) => Promise<'ok' | 'closed'> {
  // See https://github.com/backstage/backstage/issues/30659
  //
  // This code goes to some lengths to just add listeners once at the top,
  // instead of on every need to drain. Hence it is more complex that seems to
  // be necessary, just to avoid listener leaks.

  let drainPromise: DeferredPromise<'ok'> | undefined;

  const closePromise = new Promise<'closed'>(resolve => {
    function onClose() {
      res.off('drain', onDrain);
      res.off('close', onClose);
      resolve('closed');
    }
    function onDrain() {
      drainPromise?.resolve('ok');
      drainPromise = undefined;
    }
    res.on('drain', onDrain);
    res.on('close', onClose);
  });

  return async data => {
    if (drainPromise) {
      throw new Error(
        'Attempted overlapping write while waiting for previous write to drain',
      );
    }

    if (res.write(data, 'utf8')) {
      return 'ok';
    }

    if (res.closed) {
      return 'closed';
    }

    drainPromise = createDeferred();
    return Promise.race([drainPromise, closePromise]);
  };
}
