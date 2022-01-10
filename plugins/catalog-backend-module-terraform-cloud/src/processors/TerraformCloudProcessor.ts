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

import { LocationSpec, Entity } from '@backstage/catalog-model';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  results
} from '@backstage/plugin-catalog-backend';
import fetch from 'node-fetch';
import { Config } from '@backstage/config';
import  { Logger } from 'winston';

export interface ModuleResponse {
  data: ModuleResponseItem[]

}

export interface ModuleResponseItem{
  attributes: {
    name: string
    provider: string
    "version-statuses": [
      {
       version: string
      }
    ]
  }

}

export class TfCloudReaderProcessor implements CatalogProcessor {
  static fromConfig(config: Config, logger: Logger ) {
    return new TfCloudReaderProcessor(
      config,
      logger
    );
  };

  constructor(private readonly config: Config, private readonly logger: Logger) {}
    
  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'tf-cloud') {
      return false;
    }
        
    try {
             const token = this.config.getOptionalString('terraform.token')

              const modules = await this.fetchModuleData(`https://app.terraform.io/api/v2/organizations/${location.target}/registry-modules`,token);
              for (let i = 0; i < modules.data.length; i++) {
                const resourceArray = [];
                let version = modules.data[i].attributes["version-statuses"][0].version;
                version = version.split('.').join('-'); // to pass validation, can't use .
                const moduleEntity = buildModuleEntity(modules.data[i].attributes.name, version, location.target);
                emit(results.entity(location, moduleEntity ));

                const moduleResources = await this.fetchResourceData(
                 `https://app.terraform.io/api/registry/v1/modules/${location.target}/${modules.data[i].attributes.name}/${modules.data[i].attributes.provider}/${modules.data[i].attributes["version-statuses"][0].version}`
                 ,token);

                for (let resourceIndex = 0; resourceIndex < moduleResources.root.resources.length; resourceIndex++) {
                  resourceArray.push(`Resource:${moduleResources.root.resources[resourceIndex].name}`);

                  const resourceEntity = buildResourceEntity(
                    moduleResources.root.resources[resourceIndex].type,
                    modules.data[i].attributes.name,
                    moduleResources.root.resources[resourceIndex].name,
                    modules.data[i].attributes.provider,
                    modules.data[i].attributes.name,
                    location.target
                  );
                  emit(results.entity(location, resourceEntity ));    
                }
                // update the parent entity with all the resources that depend on it
                moduleEntity.spec!.dependsOn = resourceArray;
                emit(results.entity(location, moduleEntity ));
              }
           
            } catch (error) {
                const message = `Unable to read ${location.type}, ${error}`;
                this.logger.error(message);
                emit(results.generalError(location, message));
              }
    return true;
    }

    async fetchModuleData(url: string, token: string | undefined ){
      const res = await fetch(url, {
                              headers: {'Authorization': `bearer ${token}` }  
            });
      if (res.status >= 400) {
        throw new Error(`Bad response from server ${res.status}`);
      }
      return await res.json();
    }

  
  async fetchResourceData(url: string, token: string | undefined ){
    const res = await fetch(url, {
                            headers: {'Authorization': `bearer ${token}` }  
          });
    if (res.status >= 400) {
      throw new Error(`Bad response from server ${res.status}`);
    }
    return await res.json()
  }

}

  

  function buildModuleEntity(moduleName: string, version: string, tfOrg: string){
    const moduleEntity : Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      spec: {
        type: 'infrastructure-module' ,
        lifecycle: 'production',
        owner: tfOrg
      },
      metadata: {
        name: moduleName,
        namespace: 'default',
        tags: [
            `v${version}`
        ]
      }
    }  
    return moduleEntity;

  }
  function buildResourceEntity(resourceType: string, 
    dependency: string, 
    resourceName: string,
    providerName: string,
    moduleName: string,
    tfOrg: string
    ) {

    const resourceEntity : Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Resource',
      spec: {
        type: resourceType ,
        dependencyOf: [
          `Component:${dependency}`
        ],
        owner: tfOrg
       },
       
      metadata: {
        name: resourceName,
        tags: [
            `${providerName}`,
            `${moduleName}-tf-module`

        ]
      },
      }
      return resourceEntity;
  }


