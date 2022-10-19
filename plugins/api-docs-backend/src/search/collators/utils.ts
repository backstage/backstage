import { OpenAPI, OpenAPIV3_1, OpenAPIV3 } from 'openapi-types';
import {SemVer} from 'semver'
  
export const SUPPORTED_API_SPEC_TYPES = ['openapi'];


function getV3_1SpecText(spec: OpenAPIV3_1.Document) : (string|undefined)[] {
    const pathTexts: (string|undefined)[] = [];
    for( const path in spec.paths){
        pathTexts.push(path)
        const pathDetails = spec.paths[path]
        if(pathDetails){
            Object.values(OpenAPIV3.HttpMethods).forEach((method) => {
                pathTexts.push(pathDetails[method]?.summary)
                pathTexts.push(pathDetails[method]?.description)
                pathTexts.push(pathDetails[method]?.tags?.join(','))
                for( const response in  pathDetails[method]?.responses){
                    pathTexts.push(pathDetails[method]?.responses[response].description)
                }
            })
        }
    }
    return pathTexts
}


export function getSpecText(spec:OpenAPI.Document, version: SemVer) : string {
    const { description, title } = spec.info
    const documentTexts: (string|undefined)[] = [];

    documentTexts.push(title)
    documentTexts.push(description)
    
    if (version.compare('2.9.9') == 1){
        return documentTexts.concat(getV3_1SpecText(spec as OpenAPIV3_1.Document))
        .filter(x => x)
        .join(' : ')
    }

    return documentTexts.filter(x => x).join(' : ')
}
