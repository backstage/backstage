/**
 * Pulled from https://github.com/varanauskas/oatx.
 */
import type { ReferenceObject, RequestBodyObject } from 'openapi3-ts';
import type {
  ComponentRef,
  ComponentTypes,
  ObjectWithContentSchema,
  RequiredDoc,
  DocOperation,
  DocPath,
  DocPathMethod,
  DocPathTemplate,
} from './common';

type RequestBody<
  Doc extends RequiredDoc,
  Path extends Extract<keyof Doc['paths'], string>,
  Method extends keyof Doc['paths'][Path],
> = DocOperation<Doc, Path, Method>['requestBody'] extends ReferenceObject
  ? 'requestBodies' extends ComponentTypes<Doc>
    ? ComponentRef<
        Doc,
        'requestBodies',
        DocOperation<Doc, Path, Method>['requestBody']
      >
    : never
  : DocOperation<Doc, Path, Method>['requestBody'];

export type RequestBodySchema<
  Doc extends RequiredDoc,
  Path extends DocPathTemplate<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> = RequestBody<Doc, DocPath<Doc, Path>, Method> extends RequestBodyObject
  ? ObjectWithContentSchema<Doc, RequestBody<Doc, DocPath<Doc, Path>, Method>>
  : never;
