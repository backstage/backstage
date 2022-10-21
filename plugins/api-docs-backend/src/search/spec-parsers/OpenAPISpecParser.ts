/*
 * Copyright 2021 The Backstage Authors
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

import { major, coerce } from 'semver';
import { SpecParser } from './SpecHandler';
import { OpenAPI, OpenAPIV3, OpenAPIV2 } from 'openapi-types';
import { parse } from 'yaml';

export class OpenAPISpecParser implements SpecParser {
  specType: string = 'openapi';

  getV3SpecText(spec: OpenAPIV3.Document): (string | undefined)[] {
    const pathTexts: (string | undefined)[] = [];
    for (const path in spec.paths) {
      pathTexts.push(path);
      const pathDetails = spec.paths[path];
      if (pathDetails) {
        Object.values(OpenAPIV3.HttpMethods).forEach(method => {
          const pathMethod = pathDetails[method];
          pathTexts.push(pathMethod?.summary);
          pathTexts.push(pathMethod?.description);
          pathTexts.push(pathMethod?.tags?.join(','));
          for (const response in pathMethod?.responses) {
            const responseValue = pathMethod?.responses[
              response
            ] as OpenAPIV3.ResponseObject;
            pathTexts.push(responseValue?.description);
          }
        });
      }
    }
    return pathTexts;
  }

  getV2SpecText(spec: OpenAPIV2.Document): (string | undefined)[] {
    const pathTexts: (string | undefined)[] = [];
    for (const path in spec.paths) {
      const pathDetails = spec.paths[path];
      if (pathDetails) {
        Object.values(OpenAPIV2.HttpMethods).forEach(method => {
          const pathMethod = pathDetails[method];
          pathTexts.push(pathMethod?.summary);
          pathTexts.push(pathMethod?.description);
          pathTexts.push(pathMethod?.tags?.join(','));
          for (const response in pathMethod?.responses) {
            const responseValue = pathMethod?.responses[
              response
            ] as OpenAPIV2.ResponseObject;
            pathTexts.push(responseValue?.description);
          }
        });
      }
    }
    return pathTexts;
  }

  getSpecVersionText(
    spec: OpenAPI.Document,
    specVersion: string,
  ): (string | undefined)[] {
    if (specVersion.split('.')[0] === '2') {
      return this.getV2SpecText(spec as OpenAPIV2.Document);
    }

    if (major(specVersion) === 3) {
      return this.getV3SpecText(spec as OpenAPIV3.Document);
    }

    return [];
  }

  parseSpec(spec: OpenAPI.Document, specVersion: string): string {
    const { description, title } = spec.info;
    const baseDocumentText: (string | undefined)[] = [];
    baseDocumentText.push(title);
    baseDocumentText.push(description);

    const versionSpecificText = this.getSpecVersionText(spec, specVersion);

    const fullDocumentText = baseDocumentText.concat(versionSpecificText);

    return fullDocumentText.filter(x => x).join(' : ');
  }

  getSpecText(specDefinition: string) {
    const definition = parse(specDefinition);
    const version: string = definition?.openapi || definition?.swagger;
    return this.parseSpec(definition, version);
  }
}
