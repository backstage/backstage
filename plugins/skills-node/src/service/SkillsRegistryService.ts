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
  coreServices,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { DefaultSkillsRegistryService } from './DefaultSkillsRegistryService';
import { Skill } from '@backstage/plugin-skills-common';

/**
 * A source for a skill to register, where each entry points
 * to a SKILL.md file and optional additional files.
 *
 * Values can be local file paths or URLs. URLs are fetched
 * using the configured URL reader (SCM integrations).
 *
 * @public
 */
export interface SkillSource {
  /** Path or URL to the SKILL.md file. */
  skill: string;
  /** Paths or URLs to additional files for the skill. */
  additionalFiles?: string[];
}

/**
 * Service for registering skills from backend plugins and modules.
 *
 * @public
 */
export interface SkillsRegistryService {
  /** Register skills, replacing all previously registered skills for this plugin. */
  registerSkills(sources: SkillSource[]): Promise<Skill[]>;
}

/**
 * Service reference for the skills registry service.
 *
 * @public
 */
export const skillsRegistryServiceRef = createServiceRef<SkillsRegistryService>(
  {
    id: 'skills.registry',
    scope: 'plugin',
    defaultFactory: async service =>
      createServiceFactory({
        service,
        deps: {
          auth: coreServices.auth,
          discovery: coreServices.discovery,
          logger: coreServices.logger,
          urlReader: coreServices.urlReader,
        },
        factory({ auth, discovery, logger, urlReader }) {
          return DefaultSkillsRegistryService.create({
            auth,
            discovery,
            logger,
            urlReader,
          });
        },
      }),
  },
);
