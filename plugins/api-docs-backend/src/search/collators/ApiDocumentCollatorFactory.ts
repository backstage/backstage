// import { Logger } from 'winston';
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
  // GetEntitiesRequest,
} from '@backstage/catalog-client';

import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';


import {
  PluginEndpointDiscovery,
  // TokenManager,
} from '@backstage/backend-common';


import { ApiDocument } from './ApiDocument';
import { loggerToWinstonLogger } from '@backstage/backend-plugin-api';


/** @public */
export type ApiDocumentCollatorFactoryOptions = {
  discovery: PluginEndpointDiscovery;
  // tokenManager: TokenManager;
  // locationTemplate?: string;
  // filter?: GetEntitiesRequest['filter'];
  // batchSize?: number;
  catalogClient?: CatalogApi;
};


// class SerializationHelper {
//   static toInstance<T>(obj: T, json: string) : T {
//     var jsonObj = JSON.parse(json);

//     if (typeof obj["fromJSON"] === "function") {
//       obj["fromJSON"](jsonObj);
//     }
//     else {
//       for (var propName in jsonObj) {
//         obj[propName] = jsonObj[propName]
//       }
//     }

//     return obj;
//   }
// }


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
      const definition:OpenAPIV3.Document = parse(api.spec.definition)

      var indexingString = definition.info.title + "\n"
      if(definition.paths !== undefined){
        for (const path in definition.paths) {
          var path_details = definition.paths[path]
          indexingString += path_details?.summary + " "
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
