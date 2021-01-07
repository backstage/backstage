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
import {
  TemplateEntityV1alpha1,
  LOCATION_ANNOTATION,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/backend-common';
import { RemoteProtocol } from './types';

export type ParsedLocationAnnotation = {
  protocol: RemoteProtocol;
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
    RemoteProtocol?,
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

export type DeprecatedLocationTypeDetector = (
  url: string,
) => string | undefined;

// The reason for the existence of this is to help in migration to using mostly locations
// of type 'url'. This allows us to detect the deprecated location type based on the host,
// which we in turn can use to select out preparer or publisher.
//
// TODO(Rugvip): This should be removed in the future once we fully migrate to using
//               integrations configuration for the scaffolder.
export function makeDeprecatedLocationTypeDetector(
  config: Config,
): DeprecatedLocationTypeDetector {
  const hostMap = new Map();

  // These are installed by default by the integrations
  hostMap.set('github.com', 'github');
  hostMap.set('gitlab.com', 'gitlab');
  hostMap.set('dev.azure.com', 'azure/api');

  config.getOptionalConfigArray('integrations.github')?.forEach(sub => {
    hostMap.set(sub.getString('host'), 'github');
  });
  config.getOptionalConfigArray('integrations.gitlab')?.forEach(sub => {
    hostMap.set(sub.getString('host'), 'gitlab');
  });
  config.getOptionalConfigArray('integrations.azure')?.forEach(sub => {
    hostMap.set(sub.getString('host'), 'azure/api');
  });
  config.getOptionalConfigArray('integrations.bitbucket')?.forEach(sub => {
    hostMap.set(sub.getString('host'), 'bitbucket');
  });
  return (url: string): string | undefined => {
    const parsed = new URL(url);
    return hostMap.get(parsed.hostname);
  };
}
