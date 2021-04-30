/*
 * Copyright 2021 Spotify AB
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
import { EntityName, stringifyEntityRef } from '@backstage/catalog-model';
import { CatalogClient } from '@backstage/catalog-client';
import { Config } from '@backstage/config';

export interface JenkinsInfoProvider {
  getInstance(options: {
    /**
     * The entity to get the info about.
     */
    entityRef: EntityName;
    /**
     * A specific job to get. This is only passed in when we know about a job name we are interested in.
     */
    jobName?: string;
  }): Promise<JenkinsInfo>;
}

export interface JenkinsInfo {
  baseUrl: string;
  headers?: any;
  jobName: string; // TODO: make this an array
}

export class DummyJenkinsInfoProvider implements JenkinsInfoProvider {
  async getInstance(_: {
    entityRef: EntityName;
    jobName?: string;
  }): Promise<JenkinsInfo> {
    return {
      baseUrl: 'https://jenkins.internal.example.com/',
      headers: {
        Authorization:
          'Basic YWRtaW46MTFlYzI1NmU0Mzg1MDFjM2Y1Yzc2Yjc1MWE3ZTQ3YWY4Mw==',
      },
      jobName: 'department-A/team-1/project-foo',
    };
  }
}

/**
 * Use the original annotation scheme and a simple config
 */
export class SingleJenkinsInfoProvider implements JenkinsInfoProvider {
  constructor(
    private readonly catalog: CatalogClient,
    private readonly config: Config,
  ) {}

  async getInstance(opt: {
    entityRef: EntityName;
    jobName?: string;
  }): Promise<JenkinsInfo> {
    const JENKINS_ANNOTATION = 'jenkins.io/github-folder';

    // lookup jobName from entity annotation
    const entity = await this.catalog.getEntityByName(opt.entityRef);
    if (!entity) {
      throw new Error(
        `Couldn't find entity with name: ${stringifyEntityRef(opt.entityRef)}`,
      );
    }

    const jobName = entity.metadata.annotations?.[JENKINS_ANNOTATION];
    if (!jobName) {
      throw new Error(
        `Couldn't find jenkins annotation (${JENKINS_ANNOTATION}) on entity with name: ${stringifyEntityRef(
          opt.entityRef,
        )}`,
      );
    }

    // lookup baseURL + creds from config
    const baseUrl = this.config.getString('jenkins.baseUrl');
    const username = this.config.getString('jenkins.username');
    const apiKey = this.config.getString('jenkins.apiKey');
    const creds = btoa(`${username}:${apiKey}`);

    return {
      baseUrl,
      headers: {
        Authorization: `Basic ${creds}`,
      },
      jobName,
    };
  }
}

/**
 * Use a prefixed version of the original annotation scheme and a multiple instance config
 */
export class PrefixedJenkinsInfoProvider implements JenkinsInfoProvider {
  constructor(
    private readonly catalog: CatalogClient,
    private readonly config: Config,
  ) {}

  async getInstance(opt: {
    entityRef: EntityName;
    jobName?: string;
  }): Promise<JenkinsInfo> {
    const JENKINS_ANNOTATION = 'jenkins.io/github-folder';
    const DEFAULT_JENKINS_NAME = 'default';

    // lookup `[jenkinsName#]jobName` from entity annotation
    const entity = await this.catalog.getEntityByName(opt.entityRef);
    if (!entity) {
      throw new Error(
        `Couldn't find entity with name: ${stringifyEntityRef(opt.entityRef)}`,
      );
    }

    const jenkinsAndJobName = entity.metadata.annotations?.[JENKINS_ANNOTATION];
    if (!jenkinsAndJobName) {
      throw new Error(
        `Couldn't find jenkins annotation (${JENKINS_ANNOTATION}) on entity with name: ${stringifyEntityRef(
          opt.entityRef,
        )}`,
      );
    }

    let jobName;
    let jenkinsName: string;
    const splitIndex = jenkinsAndJobName.indexOf('#');
    if (splitIndex === -1) {
      // no jenkinsName specified, use default
      jenkinsName = DEFAULT_JENKINS_NAME;
      jobName = jenkinsAndJobName;
    } else {
      // There is a jenkinsName specified
      jenkinsName = jenkinsAndJobName.substring(0, splitIndex);
      jobName = jenkinsAndJobName.substring(
        splitIndex + 1,
        jenkinsAndJobName.length,
      );
    }

    // lookup baseURL + creds from config
    const instanceConfig = this.config
      .getConfigArray('jenkins.instances')
      .filter(c => c.getString('name') === jenkinsName)[0];
    if (!instanceConfig) {
      throw new Error(
        `Couldn't find a jenkins instance in the config with name ${jenkinsName}`,
      );
    }

    const baseUrl = instanceConfig.getString('baseUrl');
    const username = instanceConfig.getString('username');
    const apiKey = instanceConfig.getString('apiKey');
    const creds = btoa(`${username}:${apiKey}`);

    return {
      baseUrl,
      headers: {
        Authorization: `Basic ${creds}`,
      },
      jobName,
    };
  }
}

/**
 * Use a prefixed version of the original annotation scheme and a multiple instance config with clear "default" name
 */
export class DefaultJenkinsInfoProvider implements JenkinsInfoProvider {
  constructor(
    private readonly catalog: CatalogClient,
    private readonly config: Config,
  ) {}

  async getInstance(opt: {
    entityRef: EntityName;
    jobName?: string;
  }): Promise<JenkinsInfo> {
    const JENKINS_ANNOTATION = 'jenkins.io/github-folder';
    const DEFAULT_JENKINS_NAME = 'default';

    // lookup `[jenkinsName#]jobName` from entity annotation
    const entity = await this.catalog.getEntityByName(opt.entityRef);
    if (!entity) {
      throw new Error(
        `Couldn't find entity with name: ${stringifyEntityRef(opt.entityRef)}`,
      );
    }

    const jenkinsAndJobName = entity.metadata.annotations?.[JENKINS_ANNOTATION];
    if (!jenkinsAndJobName) {
      throw new Error(
        `Couldn't find jenkins annotation (${JENKINS_ANNOTATION}) on entity with name: ${stringifyEntityRef(
          opt.entityRef,
        )}`,
      );
    }

    let jobName;
    let jenkinsName: string;
    const splitIndex = jenkinsAndJobName.indexOf('#');
    if (splitIndex === -1) {
      // no jenkinsName specified, use default
      jenkinsName = DEFAULT_JENKINS_NAME;
      jobName = jenkinsAndJobName;
    } else {
      // There is a jenkinsName specified
      jenkinsName = jenkinsAndJobName.substring(0, splitIndex);
      jobName = jenkinsAndJobName.substring(
        splitIndex + 1,
        jenkinsAndJobName.length,
      );
    }

    // lookup baseURL + creds from config
    const instanceConfig = this.config
      .getConfigArray('jenkins.DefaultJenkinsInfoProvider.instances')
      .filter(c => c.getString('name') === jenkinsName)[0];
    if (!instanceConfig) {
      throw new Error(
        `Couldn't find a jenkins instance in the config with name ${jenkinsName}`,
      );
    }

    const baseUrl = instanceConfig.getString('baseUrl');
    const username = instanceConfig.getString('username');
    const apiKey = instanceConfig.getString('apiKey');
    const creds = btoa(`${username}:${apiKey}`);

    return {
      baseUrl,
      headers: {
        Authorization: `Basic ${creds}`,
      },
      jobName,
    };
  }
}

/**
 * Use a bespoke annotation and no config
 */
export class AcmeJenkinsInfoProvider implements JenkinsInfoProvider {
  constructor(private readonly catalog: CatalogClient) {}

  async getInstance(opt: {
    entityRef: EntityName;
    jobName?: string;
  }): Promise<JenkinsInfo> {
    const PAAS_ANNOTATION = 'acme.example.com/paas-project-name';

    // lookup pass-project-name from entity annotation
    const entity = await this.catalog.getEntityByName(opt.entityRef);
    if (!entity) {
      throw new Error(
        `Couldn't find entity with name: ${stringifyEntityRef(opt.entityRef)}`,
      );
    }

    const paasProjectName = entity.metadata.annotations?.[PAAS_ANNOTATION];
    if (!paasProjectName) {
      throw new Error(
        `Couldn't find paas annotation (${PAAS_ANNOTATION}) on entity with name: ${stringifyEntityRef(
          opt.entityRef,
        )}`,
      );
    }

    // lookup department and team for paas project name
    const { team, dept } = this.lookupPaasInfo(paasProjectName);

    const baseUrl = `https://jenkins-${dept}.example.com/`;
    const jobName = `${team}/${paasProjectName}`;
    const username = 'backstage-bot';
    const apiKey = this.getJenkinsApiKey(paasProjectName);
    const creds = btoa(`${username}:${apiKey}`);

    return {
      baseUrl,
      headers: {
        Authorization: `Basic ${creds}`,
      },
      jobName,
    };
  }

  private lookupPaasInfo(_: string): { team: string; dept: string } {
    // Mock implementation, this would get info from the paas system somehow in reality.
    return {
      team: 'teamA',
      dept: 'DepartmentA',
    };
  }

  private getJenkinsApiKey(_: string): string {
    // Mock implementation, this would get info from the paas system somehow in reality.
    return '123456789abcdef0123456789abcedf012';
  }
}
