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

import {
  AuthService,
  BackstageCredentials,
  LoggerService,
} from '@backstage/backend-plugin-api';
import {
  ClusterDetails,
  KubernetesClustersSupplier,
} from '@backstage/plugin-kubernetes-node';
import { CATALOG_FILTER_EXISTS } from '@backstage/catalog-client';
import {
  ANNOTATION_KUBERNETES_API_SERVER,
  ANNOTATION_KUBERNETES_API_SERVER_CA,
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  ANNOTATION_KUBERNETES_SKIP_METRICS_LOOKUP,
  ANNOTATION_KUBERNETES_SKIP_TLS_VERIFY,
  ANNOTATION_KUBERNETES_DASHBOARD_URL,
  ANNOTATION_KUBERNETES_DASHBOARD_APP,
  ANNOTATION_KUBERNETES_DASHBOARD_PARAMETERS,
} from '@backstage/plugin-kubernetes-common';
import { JsonObject } from '@backstage/types';
import { CatalogService } from '@backstage/plugin-catalog-node';

function isObject(obj: unknown): obj is JsonObject {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

/**
 * Options that govern how catalog-sourced Kubernetes cluster entities are
 * trusted at runtime.
 *
 * Catalog entities are user-controlled (anyone with catalog write access can
 * create them), so the URL they declare via the
 * {@link ANNOTATION_KUBERNETES_API_SERVER} annotation must be treated as
 * untrusted. Without an allowlist, an attacker who can register a malicious
 * `kubernetes-cluster` Resource can cause the backend to send its server-side
 * credentials (e.g. AWS STS bearer tokens, Azure / GCP tokens, user OIDC
 * tokens) to an arbitrary URL of their choosing.
 */
export interface CatalogClusterLocatorOptions {
  /**
   * Allowlist of origins (scheme + host + optional port) that catalog-sourced
   * clusters may target. The `kubernetes.io/api-server` annotation of an
   * entity must parse to one of these origins for the entity to be returned.
   *
   * Each entry must be an absolute URL (only the origin is used for the
   * comparison). For example, `https://my-cluster.example.com` will match an
   * entity whose api-server is `https://my-cluster.example.com/some/path`.
   *
   * If unset, the locator currently falls back to its legacy behaviour of
   * trusting any URL supplied via the annotation, with a loud deprecation
   * warning logged on first use. A future release will switch the default to
   * deny-all so that this option becomes required for the catalog locator to
   * return clusters. Configure it now to avoid the upcoming breaking change.
   */
  allowedClusterUrls?: string[];

  /**
   * Acknowledges that the catalog locator is intentionally being run without
   * an `allowedClusterUrls` allowlist and suppresses the deprecation warning.
   *
   * Setting this to `true` keeps the pre-fix behaviour of trusting any URL
   * supplied via catalog annotations. It reintroduces (or rather, retains)
   * the SSRF that `allowedClusterUrls` is designed to prevent and should
   * only be used as a short term migration aid; it does not protect against
   * the upcoming change of default to deny-all.
   *
   * @defaultValue false
   */
  allowUnsafeClusterUrls?: boolean;
}

export class CatalogClusterLocator implements KubernetesClustersSupplier {
  private readonly catalogService: CatalogService;
  private readonly auth: AuthService;
  private readonly logger: LoggerService | undefined;
  private readonly allowedOrigins: Set<string> | undefined;
  private readonly allowUnsafeClusterUrls: boolean;
  private hasLoggedDeprecation = false;

  constructor(
    catalogService: CatalogService,
    auth: AuthService,
    options?: CatalogClusterLocatorOptions & { logger?: LoggerService },
  ) {
    this.catalogService = catalogService;
    this.auth = auth;
    this.logger = options?.logger;
    this.allowUnsafeClusterUrls = options?.allowUnsafeClusterUrls === true;
    this.allowedOrigins = CatalogClusterLocator.parseAllowedOrigins(
      options?.allowedClusterUrls,
    );
  }

  static fromConfig(
    catalogApi: CatalogService,
    auth: AuthService,
    options?: CatalogClusterLocatorOptions & { logger?: LoggerService },
  ): CatalogClusterLocator {
    return new CatalogClusterLocator(catalogApi, auth, options);
  }

  async getClusters(options?: {
    credentials: BackstageCredentials;
  }): Promise<ClusterDetails[]> {
    const apiServerKey = `metadata.annotations.${ANNOTATION_KUBERNETES_API_SERVER}`;
    const apiServerCaKey = `metadata.annotations.${ANNOTATION_KUBERNETES_API_SERVER_CA}`;
    const authProviderKey = `metadata.annotations.${ANNOTATION_KUBERNETES_AUTH_PROVIDER}`;

    const filter: Record<string, symbol | string> = {
      kind: 'Resource',
      'spec.type': 'kubernetes-cluster',
      [apiServerKey]: CATALOG_FILTER_EXISTS,
      [apiServerCaKey]: CATALOG_FILTER_EXISTS,
      [authProviderKey]: CATALOG_FILTER_EXISTS,
    };

    const clusters = await this.catalogService.getEntities(
      {
        filter: [filter],
      },
      {
        credentials:
          options?.credentials ?? (await this.auth.getNoneCredentials()),
      },
    );

    const allowlistConfigured = (this.allowedOrigins?.size ?? 0) > 0;

    // When no allowlist is configured we currently fall back to the legacy
    // behaviour of trusting every URL supplied via catalog annotations. A
    // future release will switch this default to deny-all in order to fully
    // close the SSRF; until then we log a loud deprecation warning to nudge
    // operators to opt in to the allowlist (or to explicitly acknowledge the
    // risk with `allowUnsafeClusterUrls: true`).
    if (
      !allowlistConfigured &&
      !this.allowUnsafeClusterUrls &&
      !this.hasLoggedDeprecation
    ) {
      this.hasLoggedDeprecation = true;
      this.logger?.warn(
        'The catalog Kubernetes cluster locator is being used without ' +
          "'allowedClusterUrls'. Any actor with catalog write access can " +
          'currently register a `kubernetes-cluster` Resource that causes ' +
          'the backend to send its cluster credentials (AWS / Azure / GCP / ' +
          'OIDC tokens) to an arbitrary URL. Configure ' +
          "'kubernetes.clusterLocatorMethods[].allowedClusterUrls' with the " +
          'origins (scheme://host[:port]) of trusted cluster API servers to ' +
          'enforce a safe allowlist. A future release will switch the ' +
          'default to deny-all and this option will become required. To ' +
          'explicitly acknowledge the risk and silence this warning, set ' +
          "'allowUnsafeClusterUrls: true'.",
      );
    }

    return clusters.items
      .map(entity => {
        const annotations = entity.metadata.annotations!;
        const url = annotations[ANNOTATION_KUBERNETES_API_SERVER];

        if (allowlistConfigured && !this.isUrlAllowed(url)) {
          this.logger?.warn(
            `Ignoring catalog Kubernetes cluster '${entity.metadata.name}' ` +
              `because its '${ANNOTATION_KUBERNETES_API_SERVER}' annotation ` +
              `('${url}') does not match any entry in 'allowedClusterUrls'.`,
          );
          return undefined;
        }

        const clusterDetails: ClusterDetails = {
          name: entity.metadata.name,
          title: entity.metadata.title,
          url,
          authMetadata: annotations,
          caData: annotations[ANNOTATION_KUBERNETES_API_SERVER_CA],
          skipMetricsLookup:
            annotations[ANNOTATION_KUBERNETES_SKIP_METRICS_LOOKUP] === 'true',
          skipTLSVerify:
            annotations[ANNOTATION_KUBERNETES_SKIP_TLS_VERIFY] === 'true',
          dashboardUrl: annotations[ANNOTATION_KUBERNETES_DASHBOARD_URL],
          dashboardApp: annotations[ANNOTATION_KUBERNETES_DASHBOARD_APP],
          dashboardParameters: this.getDashboardParameters(annotations),
        };

        return clusterDetails;
      })
      .filter((c): c is ClusterDetails => c !== undefined);
  }

  private isUrlAllowed(rawUrl: string | undefined): boolean {
    if (!rawUrl || !this.allowedOrigins) {
      return false;
    }
    let origin: string;
    try {
      origin = new URL(rawUrl).origin;
    } catch {
      return false;
    }
    if (origin === 'null') {
      // URLs without a hostname (e.g. `file:`, opaque schemes) parse to the
      // string literal 'null'. Reject them rather than silently accept.
      return false;
    }
    return this.allowedOrigins.has(origin);
  }

  private static parseAllowedOrigins(
    allowedUrls: string[] | undefined,
  ): Set<string> | undefined {
    if (!allowedUrls || allowedUrls.length === 0) {
      return undefined;
    }
    const origins = new Set<string>();
    for (const entry of allowedUrls) {
      let origin: string;
      try {
        origin = new URL(entry).origin;
      } catch {
        throw new Error(
          `Invalid entry in 'allowedClusterUrls': '${entry}' is not a valid ` +
            'absolute URL (expected something like ' +
            "'https://my-cluster.example.com').",
        );
      }
      if (origin === 'null') {
        throw new Error(
          `Invalid entry in 'allowedClusterUrls': '${entry}' does not have ` +
            'a usable origin (scheme + host).',
        );
      }
      origins.add(origin);
    }
    return origins;
  }

  private getDashboardParameters(
    annotations: Record<string, string>,
  ): JsonObject | undefined {
    const dashboardParamsString =
      annotations[ANNOTATION_KUBERNETES_DASHBOARD_PARAMETERS];
    if (dashboardParamsString) {
      try {
        const dashboardParams = JSON.parse(dashboardParamsString);
        return isObject(dashboardParams) ? dashboardParams : undefined;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }
}
