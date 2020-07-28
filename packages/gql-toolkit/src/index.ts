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
import { mergeSchemas } from '@graphql-toolkit/schema-merging';

export class GraphQLModule {
  arg: any;
  imports: any;
  typeDefs: any;
  resolvers: any;
  constructor(arg: any) {
    this.arg = arg;
    this.typeDefs = arg.typeDefs;
    this.resolvers = arg.resolvers;
    this.imports = arg.imports || [];
  }

  get schema() {
    const downstreamTypeDefs = this.imports.map((i: any) => i.typeDefs);
    const downstreamResolvers = this.imports.map((i: any) => i.resolvers);
    const schema = mergeSchemas({
      schemas: [],
      typeDefs: [this.typeDefs, ...downstreamTypeDefs].filter(Boolean),
      resolvers: [this.resolvers, ...downstreamResolvers].filter(Boolean),
    });

    return schema;
  }
}
