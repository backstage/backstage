/*
 * Copyright 2022 The Backstage Authors
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
import { AwsS3IntegrationConfig } from './config';

const DEFAULT_REGION = 'us-east-1';

/**
 * Path style URLs: https://s3.(region).amazonaws.com/(bucket)/(key)
 * The region can also be on the old form: https://s3-(region).amazonaws.com/(bucket)/(key)
 * Virtual hosted style URLs: https://(bucket).s3.(region).amazonaws.com/(key)
 * See https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#path-style-access
 *
 * @public
 */
export function parseAwsS3Url(
  url: string,
  config: AwsS3IntegrationConfig,
): { path: string; bucket: string; region: string } {
  const parsedUrl = new URL(url);

  /**
   * Removes the leading '/' from the pathname to be processed
   * as a parameter by AWS S3 SDK getObject method.
   */
  const pathname = parsedUrl.pathname.substring(1);
  const host = parsedUrl.host;

  // Treat Amazon hosted separately because it has special region logic
  if (config.host === 'amazonaws.com') {
    const match = host.match(
      /^(?:([a-z0-9.-]+)\.)?s3(?:[.-]([a-z0-9-]+))?\.amazonaws\.com$/,
    );
    if (!match) {
      throw new Error(`Invalid AWS S3 URL ${url}`);
    }

    const [, hostBucket, hostRegion] = match;

    if (config.s3ForcePathStyle || !hostBucket) {
      const slashIndex = pathname.indexOf('/');
      if (slashIndex < 0) {
        throw new Error(
          `Invalid path-style AWS S3 URL ${url}, does not contain bucket in the path`,
        );
      }

      return {
        path: pathname.substring(slashIndex + 1),
        bucket: pathname.substring(0, slashIndex),
        region: hostRegion ?? DEFAULT_REGION,
      };
    }

    return {
      path: pathname,
      bucket: hostBucket,
      region: hostRegion ?? DEFAULT_REGION,
    };
  }

  const usePathStyle =
    config.s3ForcePathStyle || host.length === config.host.length;

  if (usePathStyle) {
    const slashIndex = pathname.indexOf('/');
    if (slashIndex < 0) {
      throw new Error(
        `Invalid path-style AWS S3 URL ${url}, does not contain bucket in the path`,
      );
    }

    return {
      path: pathname.substring(slashIndex + 1),
      bucket: pathname.substring(0, slashIndex),
      region: '',
    };
  }

  return {
    path: pathname,
    bucket: host.substring(0, host.length - config.host.length - 1),
    region: '',
  };
}
