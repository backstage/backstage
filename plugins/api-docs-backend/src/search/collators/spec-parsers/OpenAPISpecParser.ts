import {major, gt } from "semver";
import { SpecParser } from "./SpecHandler";
import { OpenAPI, OpenAPIV3_1, OpenAPIV3, OpenAPIV2 } from 'openapi-types';
import { parse } from 'yaml'


export class OpenAPISpecParser implements SpecParser {
    
    specType: string = 'openapi'

    getV3_1SpecText(spec: OpenAPIV3_1.Document) : (string|undefined)[] {
        const pathTexts: (string|undefined)[] = [];
        for( const path in spec.paths){
            pathTexts.push(path)
            const pathDetails = spec.paths[path]
            if(pathDetails){
                Object.values(OpenAPIV3.HttpMethods).forEach((method) => {
                    const pathMethod = pathDetails[method]
                    pathTexts.push(pathMethod?.summary)
                    pathTexts.push(pathMethod?.description)
                    pathTexts.push(pathMethod?.tags?.join(','))
                    for( const response in  pathMethod?.responses){
                        pathTexts.push(pathMethod?.responses[response].description)
                    }
                })
            }
        }
        return pathTexts
    }

    getV3SpecText(spec: OpenAPIV3.Document) : (string|undefined)[] { 
        const pathTexts: (string|undefined)[] = [];
        for( const path in spec.paths){
            pathTexts.push(path)
            const pathDetails = spec.paths[path]
            if(pathDetails){
                Object.values(OpenAPIV3.HttpMethods).forEach((method) => {
                    const pathMethod = pathDetails[method]
                    pathTexts.push(pathMethod?.summary)
                    pathTexts.push(pathMethod?.description)
                    pathTexts.push(pathMethod?.tags?.join(','))
                    for (const response in  pathMethod?.responses) {
                        const responseValue = pathMethod?.responses[response] as OpenAPIV3.ResponseObject
                        pathTexts.push(responseValue?.description)
                    }
                })
            }
        }
        return pathTexts
    }

    getV2SpecText(spec: OpenAPIV2.Document) : (string|undefined)[] {
        const pathTexts: (string|undefined)[] = [];
        for( const path in spec.paths){
            const pathDetails = spec.paths[path]
            if(pathDetails){
                Object.values(OpenAPIV2.HttpMethods).forEach((method) => {
                    const pathMethod = pathDetails[method]
                    pathTexts.push(pathMethod?.summary)
                    pathTexts.push(pathMethod?.description)
                    pathTexts.push(pathMethod?.tags?.join(','))
                    for (const response in  pathMethod?.responses) {
                        const responseValue = pathMethod?.responses[response] as OpenAPIV2.ResponseObject
                        pathTexts.push(responseValue?.description)
                    }
                })
            }
        }
        return pathTexts
    }

    getSpecVersionText(spec:OpenAPI.Document, specVersion: string) : (string|undefined )[] {
     if (major(specVersion) == 3){
            if (gt(specVersion,'3.0.0')) {
                return this.getV3_1SpecText(spec as OpenAPIV3_1.Document)
            }
            return this.getV3SpecText(spec as OpenAPIV3.Document)

        } else if (major(specVersion) == 2){
            return this.getV2SpecText(spec as OpenAPIV2.Document)
        }
        return []
    }

    parseSpec(spec:OpenAPI.Document, specVersion: string) : string {
        const { description, title } = spec.info
        const baseDocumentText: (string|undefined)[] = [];
        baseDocumentText.push(title)
        baseDocumentText.push(description)

        const versionSpecificText = this.getSpecVersionText(spec, specVersion)

        const fullDocumentText = baseDocumentText.concat(versionSpecificText)

        return fullDocumentText
        .filter(x => x)
        .join(' : ')
    }

    getSpecText(specDefinition: string){
        const definition = parse(specDefinition)
        const version:string = definition?.openapi
        return this.parseSpec(definition, version)
    }


}