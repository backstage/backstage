/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CatalogController } from './service/CatalogController';
import { iocContainer } from './ioc';
import { IocContainer, IocContainerFactory } from '@tsoa/runtime';
import type { RequestHandler } from 'express';
import * as express from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "RefreshOptions": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"authorizationToken":{"dataType":"string"},"entityRef":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JsonObject": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.string_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EntityLink": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"type":{"dataType":"string"},"icon":{"dataType":"string"},"title":{"dataType":"string"},"url":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EntityMeta": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"JsonObject"},{"dataType":"nestedObjectLiteral","nestedProperties":{"links":{"dataType":"array","array":{"dataType":"refAlias","ref":"EntityLink"}},"tags":{"dataType":"array","array":{"dataType":"string"}},"annotations":{"ref":"Record_string.string_"},"labels":{"ref":"Record_string.string_"},"description":{"dataType":"string"},"title":{"dataType":"string"},"namespace":{"dataType":"string"},"name":{"dataType":"string","required":true},"etag":{"dataType":"string"},"uid":{"dataType":"string"}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EntityRelation": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"targetRef":{"dataType":"string","required":true},"type":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Entity": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"relations":{"dataType":"array","array":{"dataType":"refAlias","ref":"EntityRelation"}},"spec":{"ref":"JsonObject"},"metadata":{"ref":"EntityMeta","required":true},"kind":{"dataType":"string","required":true},"apiVersion":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EntityAncestryResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"items":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"parentEntityRefs":{"dataType":"array","array":{"dataType":"string"},"required":true},"entity":{"ref":"Entity","required":true}}},"required":true},"rootEntityRef":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.Array__value-string--count-number___": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EntityFacetsResponse": {
        "dataType": "refObject",
        "properties": {
            "facets": {"ref":"Record_string.Array__value-string--count-number___","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.post('/refresh',
            ...(fetchMiddlewares<RequestHandler>(CatalogController)),
            ...(fetchMiddlewares<RequestHandler>(CatalogController.prototype.refreshEntity)),

            async function CatalogController_refreshEntity(request: any, response: any, next: any) {
            const args = {
                    refreshOptions: {"in":"body","name":"refreshOptions","required":true,"ref":"RefreshOptions"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CatalogController>(CatalogController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.refreshEntity.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/entities',
            ...(fetchMiddlewares<RequestHandler>(CatalogController)),
            ...(fetchMiddlewares<RequestHandler>(CatalogController.prototype.getEntities)),

            async function CatalogController_getEntities(request: any, response: any, next: any) {
            const args = {
                    authorization: {"in":"header","name":"authorization","dataType":"string"},
                    filter: {"in":"query","name":"filter","dataType":"string"},
                    fields: {"in":"query","name":"fields","dataType":"string"},
                    offset: {"in":"query","name":"offset","dataType":"string"},
                    limit: {"in":"query","name":"limit","dataType":"string"},
                    after: {"in":"query","name":"after","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CatalogController>(CatalogController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.getEntities.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/entities/by-uid/:uid',
            ...(fetchMiddlewares<RequestHandler>(CatalogController)),
            ...(fetchMiddlewares<RequestHandler>(CatalogController.prototype.getEntityByUid)),

            async function CatalogController_getEntityByUid(request: any, response: any, next: any) {
            const args = {
                    uid: {"in":"path","name":"uid","required":true,"dataType":"string"},
                    authorization: {"in":"header","name":"authorization","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CatalogController>(CatalogController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.getEntityByUid.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/entities/by-name/:kind/:namespace/:name',
            ...(fetchMiddlewares<RequestHandler>(CatalogController)),
            ...(fetchMiddlewares<RequestHandler>(CatalogController.prototype.getEntityByName)),

            async function CatalogController_getEntityByName(request: any, response: any, next: any) {
            const args = {
                    kind: {"in":"path","name":"kind","required":true,"dataType":"string"},
                    namespace: {"in":"path","name":"namespace","required":true,"dataType":"string"},
                    name: {"in":"path","name":"name","required":true,"dataType":"string"},
                    authorization: {"in":"header","name":"authorization","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CatalogController>(CatalogController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.getEntityByName.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/entities/by-name/:kind/:namespace/:name/ancestry',
            ...(fetchMiddlewares<RequestHandler>(CatalogController)),
            ...(fetchMiddlewares<RequestHandler>(CatalogController.prototype.getEntityAncestryByName)),

            async function CatalogController_getEntityAncestryByName(request: any, response: any, next: any) {
            const args = {
                    kind: {"in":"path","name":"kind","required":true,"dataType":"string"},
                    namespace: {"in":"path","name":"namespace","required":true,"dataType":"string"},
                    name: {"in":"path","name":"name","required":true,"dataType":"string"},
                    authorization: {"in":"header","name":"authorization","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CatalogController>(CatalogController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.getEntityAncestryByName.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/entity-facets',
            ...(fetchMiddlewares<RequestHandler>(CatalogController)),
            ...(fetchMiddlewares<RequestHandler>(CatalogController.prototype.getEntityFacets)),

            async function CatalogController_getEntityFacets(request: any, response: any, next: any) {
            const args = {
                    facet: {"in":"query","name":"facet","required":true,"dataType":"string"},
                    authorization: {"in":"header","name":"authorization","dataType":"string"},
                    filter: {"in":"query","name":"filter","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<CatalogController>(CatalogController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }


              const promise = controller.getEntityFacets.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, successStatus: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode = successStatus;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus() || statusCode;
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            data.pipe(response);
        } else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors  = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    }
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
