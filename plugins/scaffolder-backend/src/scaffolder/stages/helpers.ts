/*
 * Copyright 2020 Spotify AB
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

import { posix as posixPath } from 'path';
import {
  TemplateEntityV1alpha1,
  LOCATION_ANNOTATION,
} from '@backstage/catalog-model';
import { InputError } from '@backstage/backend-common';

export type ParsedLocationAnnotation = {
  protocol: 'file' | 'url';
  location: string;
};

export const parseLocationAnnotation = (
  entity: TemplateEntityV1alpha1,
): ParsedLocationAnnotation => {
  const annotation = entity.metadata.annotations?.[LOCATION_ANNOTATION];

  if (!annotation) {
    throw new InputError(
      `No location annotation provided in entity: ${entity.metadata.name}`,
    );
  }

  // split on the first colon for the protocol and the rest after the first split
  // is the location.
  const [protocol, location] = annotation.split(/:(.+)/) as [
    ('file' | 'url')?,
    string?,
  ];

  if (!protocol || !location) {
    throw new InputError(
      `Failure to parse either protocol or location for entity: ${entity.metadata.name}`,
    );
  }

  return {
    protocol,
    location,
  };
};

export function joinGitUrlPath(repoUrl: string, path?: string): string {
  const parsed = new URL(repoUrl);

  if (parsed.hostname.endsWith('azure.com')) {
    const templatePath = posixPath.normalize(
      posixPath.join(
        posixPath.dirname(parsed.searchParams.get('path') || '/'),
        path || '.',
      ),
    );
    parsed.searchParams.set('path', templatePath);
    return parsed.toString();
  }

  return new URL(path || '.', repoUrl).toString().replace(/\/$/, '');
}
