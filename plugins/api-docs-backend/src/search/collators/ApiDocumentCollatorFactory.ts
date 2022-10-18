import { Config } from '@backstage/config';
import { Readable } from 'stream';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { parse } from 'yaml'

import {
  ApiEntity
} from '@backstage/catalog-model';

import {
  CatalogApi,
  CatalogClient
} from '@backstage/catalog-client';

import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';


import {
  PluginEndpointDiscovery,
} from '@backstage/backend-common';


import { ApiDocument } from './ApiDocument';


/** @public */
export type ApiDocumentCollatorFactoryOptions = {
  discovery: PluginEndpointDiscovery;
  catalogClient?: CatalogApi;
};



export class ApiDocumentCollatorFactory implements DocumentCollatorFactory {

  // private readonly logger: Logger;
  public readonly type: string = 'api-definition';
  private readonly catalogClient: CatalogApi;
  

  private constructor(options: ApiDocumentCollatorFactoryOptions) {
    const {
      // batchSize,
      discovery,
      // locationTemplate,
      // filter,
      catalogClient,
      // tokenManager,
    } = options;

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

    const filter: Record<string, string> = {
      kind: 'api',
    };
    
    const entities = (
      await this.catalogClient.getEntities(
        {
          filter: filter
        }
      )
    ).items;

    for (const entity of entities) {
      const api = entity as ApiEntity;
      console.log(api.spec.type)

      if (api.spec.type == 'graphql'){
        continue
      }
  

      console.log(parse(api.spec.definition))
      const definition:OpenAPIV3_1.Document = parse(api.spec.definition)

      var indexingString = definition.info.title + "\n"
      if(definition.paths !== undefined){
        for (const path in definition.paths) {
          var path_details = definition.paths[path]
          indexingString += path_details?.get?.summary + " "
          indexingString += path + "\n"
        }
      }

      yield {
        title: entity.metadata.name,
        location: `/catalog/default/api/${entity.metadata.name}/definition/`,
        text: indexingString,
        kind: entity.kind,
        lifecycle: (entity.spec?.lifecycle as string) || '',
      }
    }
  }
}
