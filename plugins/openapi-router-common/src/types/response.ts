/**
 * Pulled from https://github.com/varanauskas/oatx.
 */
import type { ReferenceObject, ResponseObject } from 'openapi3-ts';
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

type Response<
  Doc extends RequiredDoc,
  Path extends keyof Doc['paths'],
  Method extends keyof Doc['paths'][Path],
  StatusCode extends keyof Doc['paths'][Path]['responses'],
> = DocOperation<
  Doc,
  Path,
  Method
>['responses'][StatusCode] extends ReferenceObject
  ? 'responses' extends ComponentTypes<Doc>
    ? ComponentRef<
        Doc,
        'responses',
        DocOperation<Doc, Path, Method>['responses'][StatusCode]
      >
    : never
  : DocOperation<Doc, Path, Method>['responses'][StatusCode];

type Responses<
  Doc extends RequiredDoc,
  Path extends keyof Doc['paths'],
  Method extends keyof Doc['paths'][Path],
> = {
  [StatusCode in keyof DocOperation<Doc, Path, Method>['responses']]: Response<
    Doc,
    Path,
    Method,
    StatusCode
  >;
};

export type ResponseSchema<
  Doc extends RequiredDoc,
  Object extends ResponseObject,
> = ObjectWithContentSchema<Doc, Object>;

export type ResponseSchemas<
  Doc extends RequiredDoc,
  Path extends DocPathTemplate<Doc>,
  Method extends DocPathMethod<Doc, Path>,
> = {
  [StatusCode in keyof Responses<Doc, DocPath<Doc, Path>, Method>]: Responses<
    Doc,
    DocPath<Doc, Path>,
    Method
  >[StatusCode] extends ResponseObject
    ? ResponseSchema<
        Doc,
        Responses<Doc, DocPath<Doc, Path>, Method>[StatusCode]
      >
    : never;
};
