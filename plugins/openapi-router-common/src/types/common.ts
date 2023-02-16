/**
 * Pulled from https://github.com/varanauskas/oatx.
 */

import type {
  ContentObject,
  OpenAPIObject,
  ReferenceObject,
} from 'openapi3-ts';

export type RequiredDoc = Pick<OpenAPIObject, 'paths' | 'components'>;
export type PathDoc = { paths: Record<string, unknown> };

/**
 * Get value types of `T`
 */
export type ValueOf<T> = T[keyof T];

/**
 * Validate a string against OpenAPI path template
 * ```
 * const path = PathTemplate<"/posts/{postId}/comments/{commentId}"> = "/posts/1/comments/2"const pathWithParams: PathTemplate<"/posts/{postId}/comments/{commentId}"> = "/posts/1/comments/2";
 * const pathWithoutParams: PathTemplate<"/posts/comments"> = "/posts/comments";```
 * https://spec.openapis.org/oas/v3.1.0#path-templating-matching
 */
export type PathTemplate<Path extends string> =
  Path extends `${infer Prefix}{${string}}${infer Suffix}`
    ? `${Prefix}${string}${PathTemplate<Suffix>}`
    : Path;

/**
 * Extract path as specified in OpenAPI `Doc` based on request path
 * ```
 * const spec = {
 *   paths: {
 *       "/posts/{postId}/comments/{commentId}": {},
 *       "/posts/comments": {},
 *   }
 * };
 * const specPathWithParams: DocPath<typeof spec, "/posts/1/comments/2"> = "/posts/{postId}/comments/{commentId}";
 * const specPathWithoutParams: DocPath<typeof spec, "/posts/comments"> = "/posts/comments";
 * ```
 */
export type DocPath<
  Doc extends PathDoc,
  Path extends PathTemplate<Extract<keyof Doc['paths'], string>>,
> = ValueOf<{
  [Template in Extract<
    keyof Doc['paths'],
    string
  >]: Path extends PathTemplate<Template> ? Template : never;
}>;

export type DocPathTemplate<Doc extends PathDoc> = PathTemplate<
  Extract<keyof Doc['paths'], string>
>;

export type DocPathMethod<
  Doc extends Pick<RequiredDoc, 'paths'>,
  Path extends DocPathTemplate<Doc>,
> = keyof Doc['paths'][DocPath<Doc, Path>];

export type MethodAwareDocPath<
  Doc extends PathDoc,
  Path extends PathTemplate<Extract<keyof Doc['paths'], string>>,
  Method extends keyof Doc['paths'][Path],
> = ValueOf<{
  [Template in Extract<
    keyof Doc['paths'],
    string
  >]: Path extends PathTemplate<Template>
    ? Method extends DocPathMethod<Doc, Path>
      ? PathTemplate<Template>
      : never
    : never;
}>;

export type DocOperation<
  Doc extends RequiredDoc,
  Path extends keyof Doc['paths'],
  Method extends keyof Doc['paths'][Path],
> = Doc['paths'][Path][Method];

export type ComponentTypes<Doc extends RequiredDoc> = Extract<
  keyof Doc['components'],
  string
>;

export type ComponentRef<
  Doc extends RequiredDoc,
  Type extends ComponentTypes<Doc>,
  Ref extends ReferenceObject,
> = Ref extends { $ref: `#/components/${Type}/${infer Name}` }
  ? Name extends keyof Doc['components'][Type]
    ? Doc['components'][Type][Name] extends ReferenceObject
      ? ComponentRef<Doc, Type, Doc['components'][Type][Name]>
      : Doc['components'][Type][Name]
    : never
  : never;

export type SchemaRef<Doc extends RequiredDoc, Schema> = Schema extends {
  $ref: `#/components/schemas/${infer Name}`;
}
  ? 'schemas' extends keyof Doc['components']
    ? Name extends keyof Doc['components']['schemas']
      ? SchemaRef<Doc, Doc['components']['schemas'][Name]>
      : never
    : never
  : { [Key in keyof Schema]: SchemaRef<Doc, Schema[Key]> };

export type ObjectWithContentSchema<
  Doc extends RequiredDoc,
  Object extends { content?: ContentObject },
> = Object['content'] extends ContentObject
  ? SchemaRef<Doc, Object['content']['application/json']['schema']>
  : never;
