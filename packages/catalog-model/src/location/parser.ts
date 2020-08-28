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

import { LocationSpec, LOCATION_TYPES, LocationType } from './';
import path from 'path';
import os from 'os';
import fs from 'fs';
import parseGitUrl from 'git-url-parse';
import { Clone, Repository } from 'nodegit';


/**
 * A policy for validation or mutation to be applied to entities as they are
 * entering the system.
 */
type LocationImpl = {
  /**
   * Parses and validates a location string.
   *
   * @returns A LocationSpec type object
   * @throws An error if the location is not valid
   */
  parse(): LocationSpec;

  /**
   * Gives you a local working directory for a location string.
   *
   * @returns A string containing the path to the directory
   * @throws An error if anything goes wrong
   */
  getLocalDirectory(): Promise<string> | string;
};

export class Location implements LocationImpl {
  private location: string;

  constructor(location: string) {
    this.location = location;
  }

  private isLocationType(key: string): key is LocationType {
    return LOCATION_TYPES.includes(key as LocationType);
  }

  parse(): LocationSpec {
    const [type, target] = this.location.split(':');

    if (!type || !target) {
      throw new Error(
        `Invalid location string ${this.location} in Location.parse`,
      );
    }

    if (!this.isLocationType(type)) {
      throw new Error(`Invalid LocationType ${type} in Location.parse`);
    }

    return {
      type,
      target,
    };
  }

  private async cloneRemoteRepository(repoUrl: string) {
    const parsedGitLocation = parseGitUrl(repoUrl);

    const repositoryTmpPath = path.join(
      // fs.realpathSync fixes a problem with macOS returning a path that is a symlink
      fs.realpathSync(os.tmpdir()),
      'backstage-repo',
      parsedGitLocation.source,
      parsedGitLocation.owner,
      parsedGitLocation.name,
      parsedGitLocation.ref,
    );
  
    if (fs.existsSync(repositoryTmpPath)) {
      const repository = await Repository.open(repositoryTmpPath);
      await repository.mergeBranches(
        parsedGitLocation.ref,
        `origin/${parsedGitLocation.ref}`,
      );
      return repositoryTmpPath;
    }
  
    const repositoryCheckoutUrl = parsedGitLocation.toString('https');
  
    fs.mkdirSync(repositoryTmpPath, { recursive: true });
    await Clone.clone(repositoryCheckoutUrl, repositoryTmpPath, {});
  
    return repositoryTmpPath;
  }

  getLocalDirectory(): Promise<string> | string {
    const { type, target } = this.parse();

    switch(type) {
      case 'github':
        return this.cloneRemoteRepository(target);
      case 'file':
      case 'dir':
        if (path.isAbsolute(target)) {
          return target;
        }
        throw new Error(`Unable to get path for a relative ${type} in Location.getLocalDirectory`);
      default:
        throw new Error(`${type} is not a recognized LocationType`);
    }

    return Promise.resolve('');
  }
}
