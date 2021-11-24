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
import {
  RemoteProtocol,
  ParsedLocationAnnotation,
} from '@backstage/techdocs-common';
import * as winston from 'winston';

export const convertTechDocsRefToLocationAnnotation = (
  techdocsRef: string,
): ParsedLocationAnnotation => {
  // Split on the first colon for the protocol and the rest after the first split
  // is the location.
  const [type, target] = techdocsRef.split(/:(.+)/) as [
    RemoteProtocol?,
    string?,
  ];

  if (!type || !target) {
    throw new Error(
      `Can not parse --techdocs-ref ${techdocsRef}. Should be of type HOST:URL.`,
    );
  }

  return { type, target };
};

export const createLogger = ({
  verbose = false,
}: {
  verbose: boolean;
}): winston.Logger => {
  const logger = winston.createLogger({
    level: verbose ? 'verbose' : 'info',
    transports: [
      new winston.transports.Console({ format: winston.format.simple() }),
    ],
  });

  return logger;
};
