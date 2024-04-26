/*
 * Copyright 2023 The Backstage Authors
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
import { createApiRef } from '@backstage/core-plugin-api';
import { VoyagerDisplayOptions } from 'graphql-voyager/typings/components/Voyager';
import { WorkerCallback } from 'graphql-voyager/typings/utils/types';

/** @public */
export type GraphQLVoyagerEndpoint = {
  id: string;
  title: string;
  introspection: (body: any) => Promise<any>;
  introspectionErrorMessage: string;
  voyagerProps?: {
    displayOptions?: VoyagerDisplayOptions;
    hideDocs?: boolean;
    hideSettings?: boolean;
    workerURI?: string;
    loadWorker?: WorkerCallback;
  };
};

/** @public */
export type GraphQLVoyagerApi = {
  getEndpoints(): Promise<GraphQLVoyagerEndpoint[]>;
};

/** @public */
export const graphQlVoyagerApiRef = createApiRef<GraphQLVoyagerApi>({
  id: 'plugin.graphqlvoyager.api',
});

/** @public */
export const introspectionQuery: string = `query IntrospectionQuery {
      __schema {
        
        queryType { name }
        mutationType { name }
        subscriptionType { name }
        types {
          ...FullType
        }
        directives {
          name
          description
          
          locations
          args {
            ...InputValue
          }
        }
      }
    }

    fragment FullType on __Type {
      kind
      name
      description
      
      fields(includeDeprecated: true) {
        name
        description
        args {
          ...InputValue
        }
        type {
          ...TypeRef
        }
        isDeprecated
        deprecationReason
      }
      inputFields {
        ...InputValue
      }
      interfaces {
        ...TypeRef
      }
      enumValues(includeDeprecated: true) {
        name
        description
        isDeprecated
        deprecationReason
      }
      possibleTypes {
        ...TypeRef
      }
    }

    fragment InputValue on __InputValue {
      name
      description
      type { ...TypeRef }
      defaultValue
      
      
    }

    fragment TypeRef on __Type {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                  }
                }
              }
            }
          }
        }
      }
    }`;
