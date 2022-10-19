import {
  PluginEndpointDiscovery,
  TokenManager,
} from '@backstage/backend-common';

import { Config } from '@backstage/config';
import { Readable } from 'stream';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { parse } from 'yaml'

import {SemVer} from 'semver'

import {
  CatalogApi,
  CatalogClient
} from '@backstage/catalog-client';


import { SUPPORTED_API_SPEC_TYPES, getSpecText } from './utils';



import { ApiDocument } from './ApiDocument';


/** @public */
export type ApiDocumentCollatorFactoryOptions = {
  discovery: PluginEndpointDiscovery;
  catalogClient?: CatalogApi;
  batchSize?: number;
  tokenManager: TokenManager;
};


export class ApiDocumentCollatorFactory implements DocumentCollatorFactory {


  // private readonly logger: Logger;
  public readonly type: string = 'api-definition';
  private readonly catalogClient: CatalogApi;
  private batchSize: number;
  private tokenManager: TokenManager;

  private constructor(options: ApiDocumentCollatorFactoryOptions) {
    const {
      discovery,
      catalogClient,
      batchSize,
      tokenManager,
    } = options;

    this.tokenManager = tokenManager
    this.batchSize = batchSize || 500;
    this.catalogClient =
      catalogClient || new CatalogClient({ discoveryApi: discovery });
  }


  static fromConfig(
    _config: Config,
    options: ApiDocumentCollatorFactoryOptions,
  ) {
    return new ApiDocumentCollatorFactory(options);
  }


  async getCollator() {
    return Readable.from(this.execute());
  }


  async *execute(): AsyncGenerator<ApiDocument> {
    const { token } = await this.tokenManager.getToken();
    let entitiesRetrieved = 0;
    let moreEntitiesToGet = true;


    while (moreEntitiesToGet) {
      const entities = (
        await this.catalogClient.getEntities(
          {
            filter: {
              kind: 'api',
            },
            limit: this.batchSize,
            offset: entitiesRetrieved,
          },
          { token }
        )
      ).items;

      moreEntitiesToGet = entities.length === this.batchSize;
      entitiesRetrieved += entities.length;

      for (const entity of entities) {
        
        const isSuppportedSpecType = SUPPORTED_API_SPEC_TYPES.includes((entity.spec?.type as string))

        if(!isSuppportedSpecType){
          continue
        }

        const definition = parse((entity.spec?.definition as string) || '')
        const version:string = definition?.openapi


        yield {
          title: entity.metadata.name,
          location: `/catalog/default/api/${entity.metadata.name}/definition/`,
          text: getSpecText(definition, new SemVer(version)),
          kind: entity.kind,
          lifecycle: (entity.spec?.lifecycle as string) || '',
        }
      }
    }
  }
}
