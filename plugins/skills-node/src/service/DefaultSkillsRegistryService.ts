/*
 * Copyright 2026 The Backstage Authors
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
  AuthService,
  DiscoveryService,
  LoggerService,
  UrlReaderService,
} from '@backstage/backend-plugin-api';
import { SkillsRegistryService, SkillSource } from './SkillsRegistryService';
import {
  Skill,
  SkillFile,
  SkillsClient,
} from '@backstage/plugin-skills-common';
import { dirname, posix, relative } from 'node:path';
import { readFile } from 'node:fs/promises';

/**
 * Options for creating a {@link DefaultSkillsRegistryService}.
 *
 * @public
 */
export interface DefaultSkillsRegistryServiceOptions {
  auth: AuthService;
  discovery: DiscoveryService;
  logger: LoggerService;
  urlReader: UrlReaderService;
}

/**
 * Default implementation of the skills registry service that reads skill
 * files from the filesystem or SCM via URL reader, and sends them to
 * the skills backend using the SkillsClient.
 *
 * @public
 */
export class DefaultSkillsRegistryService implements SkillsRegistryService {
  private readonly client: SkillsClient;
  private readonly auth: AuthService;
  private readonly logger: LoggerService;
  private readonly urlReader: UrlReaderService;

  private constructor(
    client: SkillsClient,
    auth: AuthService,
    logger: LoggerService,
    urlReader: UrlReaderService,
  ) {
    this.client = client;
    this.auth = auth;
    this.logger = logger;
    this.urlReader = urlReader;
  }

  static create(
    options: DefaultSkillsRegistryServiceOptions,
  ): DefaultSkillsRegistryService {
    const { auth, discovery, logger, urlReader } = options;

    const client = new SkillsClient({
      discoveryApi: discovery,
      fetchApi: { fetch },
    });

    return new DefaultSkillsRegistryService(client, auth, logger, urlReader);
  }

  async registerSkills(sources: SkillSource[]): Promise<Skill[]> {
    const skills: Array<{ files: SkillFile[] }> = [];

    for (const source of sources) {
      const skillContent = await this.tryGetSkillContent(source.skill);

      if (!skillContent) {
        continue;
      }

      const files: SkillFile[] = [{ path: 'SKILL.md', content: skillContent }];

      if (source.additionalFiles) {
        for (const filePath of source.additionalFiles) {
          const additionalFile = await this.tryGetAdditionalFile(
            source.skill,
            filePath,
          );

          if (additionalFile) {
            files.push(additionalFile);
          }
        }
      }

      skills.push({ files });
    }

    if (skills.length === 0) {
      return [];
    }

    const { token } = await this.auth.getPluginRequestToken({
      onBehalfOf: await this.auth.getOwnServiceCredentials(),
      targetPluginId: 'skills',
    });

    return this.client.registerSkills({ skills }, { token });
  }

  private async tryGetSkillContent(
    location: string,
  ): Promise<string | undefined> {
    try {
      return await this.readContent(location);
    } catch (error) {
      this.logger.warn(
        `Skipping skill '${location}' because it could not be processed: ${this.formatError(
          error,
        )}`,
      );
      return undefined;
    }
  }

  private async tryGetAdditionalFile(
    skillLocation: string,
    fileLocation: string,
  ): Promise<SkillFile | undefined> {
    try {
      const content = await this.readContent(fileLocation);
      const path = this.toSkillRelativePath(skillLocation, fileLocation);
      return { path, content };
    } catch (error) {
      this.logger.warn(
        `Skipping additional file '${fileLocation}' for skill '${skillLocation}' because it could not be processed: ${this.formatError(
          error,
        )}`,
      );
      return undefined;
    }
  }

  private async readContent(location: string): Promise<string> {
    if (location.startsWith('https://') || location.startsWith('http://')) {
      const response = await this.urlReader.readUrl(location);
      const buffer = await response.buffer();
      return buffer.toString('utf-8');
    }
    return readFile(location, 'utf-8');
  }

  private toSkillRelativePath(
    skillLocation: string,
    fileLocation: string,
  ): string {
    if (this.isUrl(skillLocation) !== this.isUrl(fileLocation)) {
      throw new Error(
        'Skill files must use the same source type as the skill definition',
      );
    }

    if (this.isUrl(skillLocation) && this.isUrl(fileLocation)) {
      const skillUrl = new URL(skillLocation);
      const fileUrl = new URL(fileLocation);

      if (skillUrl.origin !== fileUrl.origin) {
        throw new Error(
          'Skill files fetched by URL must share the same origin',
        );
      }

      const relativePath = posix.relative(
        posix.dirname(skillUrl.pathname),
        fileUrl.pathname,
      );
      return this.assertRelativeSkillFilePath(relativePath, fileLocation);
    }

    const relativePath = relative(dirname(skillLocation), fileLocation)
      .split('\\')
      .join('/');
    return this.assertRelativeSkillFilePath(relativePath, fileLocation);
  }

  private assertRelativeSkillFilePath(
    relativePath: string,
    fileLocation: string,
  ): string {
    if (
      !relativePath ||
      relativePath === '.' ||
      relativePath === 'SKILL.md' ||
      relativePath.startsWith('../') ||
      relativePath === '..' ||
      posix.isAbsolute(relativePath)
    ) {
      throw new Error(
        `Additional file '${fileLocation}' must be located under the skill directory`,
      );
    }

    return relativePath;
  }

  private isUrl(location: string): boolean {
    return location.startsWith('https://') || location.startsWith('http://');
  }

  private formatError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }
}
