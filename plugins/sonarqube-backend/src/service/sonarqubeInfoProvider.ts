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

import { Config } from '@backstage/config';
import fetch from 'node-fetch';

/**
 * Provide information about sonarqube instances and projects contained within
 * @public
 */
export interface SonarqubeInfoProvider {
  /**
   * Get the sonarqube URL in configuration from a provided instanceName.
   *
   * If instanceName is omitted, default sonarqube instance is queried in config
   *
   * @param instanceName - Name of the sonarqube instance to get the info from
   * @returns the url of the instance
   */
  getBaseUrl(options?: { instanceName?: string }): { baseUrl: string };

  /**
   * Query the sonarqube instance corresponding to the instanceName to get all
   * measures for the component of key componentKey.
   *
   * If instanceName is omitted, default sonarqube instance is queried in config
   *
   * @param componentKey - component key of the project we want to get measure from.
   * @param instanceName - name of the instance (in config) where the project is hosted.
   * @returns All measures with the analysis date. Will return undefined if we
   * can't provide the full response
   */
  getFindings(options: {
    componentKey: string;
    instanceName?: string;
  }): Promise<SonarqubeFindings | undefined>;
}

/**
 * Information retrieved for a specific project in Sonarqube
 * @public
 */
export interface SonarqubeFindings {
  /**
   * Last date of the analysis that have generated this finding
   */
  analysisDate: string;
  /**
   * All measures pertaining to the findings
   */
  measures: SonarqubeMeasure[];
}

interface MeasuresWrapper {
  component: { measures: SonarqubeMeasure[] };
}

/**
 * A specific measure on a project in Sonarqube
 * @public
 */
export interface SonarqubeMeasure {
  /**
   * Name of the measure
   */
  metric: string;
  /**
   * Value of the measure
   */
  value: string;
}

/**
 * Information about a Sonarqube instance.
 * @public
 */
export interface SonarqubeInstanceConfig {
  /**
   * Name of the instance. An instance name in configuration and catalog should match.
   */
  name: string;
  /**
   * Base url to access the instance
   */
  baseUrl: string;
  /**
   * Access token to access the sonarqube instance as generated in user profile.
   */
  apiKey: string;
}

interface ComponentWrapper {
  component: { analysisDate: string };
}

/**
 * Holds multiple Sonarqube configurations.
 * @public
 */
export class SonarqubeConfig {
  /**
   *
   * @param instances - All information on all sonarqube instance from the config file
   */
  constructor(public readonly instances: SonarqubeInstanceConfig[]) {}

  /**
   * Read all Sonarqube instance configurations.
   * @param config - Root configuration
   * @returns A SonarqubeConfig that contains all configured Sonarqube instances.
   */
  static fromConfig(config: Config): SonarqubeConfig {
    const DEFAULT_SONARQUBE_NAME = 'default';

    const sonarqubeConfig = config.getConfig('sonarqube');

    // load all named instance config
    const namedInstanceConfig =
      sonarqubeConfig.getOptionalConfigArray('instances')?.map(c => ({
        name: c.getString('name'),
        baseUrl: c.getString('baseUrl'),
        apiKey: c.getString('apiKey'),
      })) || [];

    // load unnamed default config
    const hasNamedDefault = namedInstanceConfig.some(
      x => x.name === DEFAULT_SONARQUBE_NAME,
    );

    // Get these as optional strings and check to give a better error message
    const baseUrl = sonarqubeConfig.getOptionalString('baseUrl');
    const apiKey = sonarqubeConfig.getOptionalString('apiKey');

    if (hasNamedDefault && (baseUrl || apiKey)) {
      throw new Error(
        `Found both a named sonarqube instance with name ${DEFAULT_SONARQUBE_NAME} and top level baseUrl or apiKey config. Use only one style of config.`,
      );
    }

    const unnamedNonePresent = !baseUrl && !apiKey;
    const unnamedAllPresent = baseUrl && apiKey;
    if (!(unnamedAllPresent || unnamedNonePresent)) {
      throw new Error(
        `Found partial default sonarqube config. All (or none) of baseUrl and apiKey must be provided.`,
      );
    }

    if (unnamedAllPresent) {
      const unnamedInstanceConfig = [
        { name: DEFAULT_SONARQUBE_NAME, baseUrl, apiKey },
      ] as {
        name: string;
        baseUrl: string;
        apiKey: string;
      }[];

      return new SonarqubeConfig([
        ...namedInstanceConfig,
        ...unnamedInstanceConfig,
      ]);
    }

    return new SonarqubeConfig(namedInstanceConfig);
  }

  /**
   * Gets a Sonarqube instance configuration by name, or the default one if no name is provided.
   * @param sonarqubeName - Optional name of the Sonarqube instance.
   * @returns The requested Sonarqube instance.
   * @throws Error when no default config could be found or the requested name couldn't be found in config.
   */
  getInstanceConfig(
    options: { sonarqubeName?: string } = {},
  ): SonarqubeInstanceConfig {
    const { sonarqubeName } = options;
    const DEFAULT_SONARQUBE_NAME = 'default';

    if (!sonarqubeName || sonarqubeName === DEFAULT_SONARQUBE_NAME) {
      // no name provided, use default
      const instanceConfig = this.instances.find(
        c => c.name === DEFAULT_SONARQUBE_NAME,
      );

      if (!instanceConfig) {
        throw new Error(
          `Couldn't find a default sonarqube instance in the config. Either configure an instance with name ${DEFAULT_SONARQUBE_NAME} or add a prefix to your annotation value.`,
        );
      }

      return instanceConfig;
    }

    // A name is provided, look it up.
    const instanceConfig = this.instances.find(c => c.name === sonarqubeName);

    if (!instanceConfig) {
      throw new Error(
        `Couldn't find a sonarqube instance in the config with name ${sonarqubeName}`,
      );
    }
    return instanceConfig;
  }
}

/**
 * @public
 *
 * Use default config and annotations, build using fromConfig static function.
 */
export class DefaultSonarqubeInfoProvider implements SonarqubeInfoProvider {
  private constructor(private readonly config: SonarqubeConfig) {}

  /**
   * Generate an instance from a Config instance
   * @param config - Backend configuration
   */
  static fromConfig(config: Config): DefaultSonarqubeInfoProvider {
    return new DefaultSonarqubeInfoProvider(SonarqubeConfig.fromConfig(config));
  }

  /**
   * Retrieve all supported metrics from a sonarqube instance.
   *
   * @param instanceUrl - URL of the sonarqube instance
   * @param token - token to access the sonarqube instance
   * @returns The list of supported metrics, if no metrics are supported an empty list is provided in the promise
   * @private
   */
  private static async getSupportedMetrics(
    instanceUrl: string,
    token: string,
  ): Promise<string[]> {
    const metrics: string[] = [];
    let nextPage: number = 1;

    for (;;) {
      const result = await DefaultSonarqubeInfoProvider.callApi<{
        metrics: Array<{ key: string }>;
        total: number;
      }>(instanceUrl, 'api/metrics/search', token, { ps: 500, p: nextPage });
      metrics.push(...(result?.metrics?.map(m => m.key) ?? []));

      if (result && metrics.length < result.total) {
        nextPage++;
        continue;
      }

      return metrics;
    }
  }

  /**
   * Call an API with provided arguments
   * @param url - URL of the API to call
   * @param path - path to call
   * @param authToken - token used as basic auth user without password
   * @param query - parameters to provide to the call
   * @returns A promise on the answer to the API call if the answer status code is 200, undefined otherwise.
   * @private
   */
  private static async callApi<T>(
    url: string,
    path: string,
    authToken: string,
    query: { [key in string]: any },
  ): Promise<T | undefined> {
    // Sonarqube auth use basic with token as username and no password
    // but standard dictate the colon (separator) need to stay here despite the
    // lack of password
    const encodedAuthToken = Buffer.from(`${authToken}:`).toString('base64');

    const response = await fetch(
      `${url}/${path}?${new URLSearchParams(query).toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${encodedAuthToken}`,
        },
      },
    );
    if (response.status === 200) {
      return (await response.json()) as T;
    }
    return undefined;
  }

  /**
   * {@inheritDoc SonarqubeInfoProvider.getBaseUrl}
   * @throws Error If configuration can't be retrieved.
   */
  getBaseUrl(options: { instanceName?: string } = {}): {
    baseUrl: string;
  } {
    const instanceConfig = this.config.getInstanceConfig({
      sonarqubeName: options.instanceName,
    });
    return { baseUrl: instanceConfig.baseUrl };
  }

  /**
   * {@inheritDoc SonarqubeInfoProvider.getFindings}
   * @throws Error If configuration can't be retrieved.
   */
  async getFindings(options: {
    componentKey: string;
    instanceName?: string;
  }): Promise<SonarqubeFindings | undefined> {
    const { componentKey, instanceName } = options;
    const { baseUrl, apiKey } = this.config.getInstanceConfig({
      sonarqubeName: instanceName,
    });

    // get component info to retrieve analysis date
    const component =
      await DefaultSonarqubeInfoProvider.callApi<ComponentWrapper>(
        baseUrl,
        'api/components/show',
        apiKey,
        {
          component: componentKey,
        },
      );
    if (!component || !component.component) {
      return undefined;
    }

    // select the metrics that are supported by the SonarQube instance
    const supportedMetrics =
      await DefaultSonarqubeInfoProvider.getSupportedMetrics(baseUrl, apiKey);
    const wantedMetrics: string[] = [
      'alert_status',
      'bugs',
      'reliability_rating',
      'vulnerabilities',
      'security_rating',
      'security_hotspots_reviewed',
      'security_review_rating',
      'code_smells',
      'sqale_rating',
      'coverage',
      'duplicated_lines_density',
    ];

    // only retrieve wanted metrics that are supported
    const metricsToQuery = wantedMetrics.filter(el =>
      supportedMetrics.includes(el),
    );

    // get all measures
    const measures =
      await DefaultSonarqubeInfoProvider.callApi<MeasuresWrapper>(
        baseUrl,
        'api/measures/component',
        apiKey,
        {
          component: componentKey,
          metricKeys: metricsToQuery.join(','),
        },
      );
    if (!measures) {
      return undefined;
    }

    return {
      analysisDate: component.component.analysisDate,
      measures: measures.component?.measures ?? [],
    };
  }
}
