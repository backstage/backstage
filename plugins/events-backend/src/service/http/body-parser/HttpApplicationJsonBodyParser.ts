/*
 * Copyright 2025 The Backstage Authors
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
import { HttpBodyParser } from '@backstage/plugin-events-node';
import { UnsupportedCharsetError } from '../errors';

export const HttpApplicationJsonBodyParser: HttpBodyParser = async (
  request,
  parsedMediaType,
  topic,
) => {
  const requestBody = request.body;
  if (!Buffer.isBuffer(requestBody)) {
    throw new Error(
      `Failed to retrieve raw body from incoming event for topic ${topic}; not a buffer: ${typeof requestBody}`,
    );
  }

  const bodyBuffer: Buffer = requestBody;

  const encoding = parsedMediaType.parameters.charset ?? 'utf-8';
  if (!Buffer.isEncoding(encoding)) {
    throw new UnsupportedCharsetError(encoding);
  }

  const bodyString = bodyBuffer.toString(encoding);
  const bodyParsed =
    parsedMediaType.type === 'application/json'
      ? JSON.parse(bodyString)
      : bodyString;
  return { bodyParsed, bodyBuffer, encoding };
};
