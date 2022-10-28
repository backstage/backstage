# Introduction

This file describes the various style and design conventions that are used in the Backstage main repository. While you may choose to use these conventions in your own Backstage projects, it is not required.

# TypeScript Coding Conventions

Our TypeScript style is inspired by the [style guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines) of the TypeScript implementation itself.

## Naming

1. Use PascalCase for type names.
1. Do not use `I` as a prefix for interface names.
1. Use PascalCase for `enum` values.
1. Use `camelCase` for function names.
1. Use `camelCase` for property names and local variables.
1. Do not use `_` as a prefix for private properties.
1. Use whole words in names when possible.
1. Give type parameters names prefixed with `T`, for example `Request<TBody>`.

## Syntax and Types

1. Use `undefined`. Do not use `null`.
1. Prefer `for..of` over `.forEach`.
1. Do not introduce new types/values to the global namespace.

## File and Export Structure

1. Shared types should be defined in `types.ts`.
1. Keep `index.ts` free from implementation, it should only contain re-exports.
1. If a file has a single or a main export, name the file after the export.

## Error Handling

1. Rely on `@backstage/errors` for custom error types.
   ```ts
   throw new NotFoundError(`Could not find resource with id '${id}'`);
   ```
1. Check error types by comparing the name
   ```ts
   if (error.name === 'NotFoundError') {
     // ...
   }
   ```
1. Use `ResponseError` to convert `fetch` error responses.
   ```ts
   if (!res.ok) {
     throw await ResponseError.fromResponse(res);
   }
   ```

## API Design

This section describes guidelines for designing public APIs. It can also be applied to internal implementations, but it is less necessary.

1. Keep [SOLID](https://en.wikipedia.org/wiki/SOLID) principles in mind.
1. Be mindful of the number of top-level exports of each package, strive to keep it low.
1. Prioritize consistency over correctness, stick to existing patterns within the same class/file/folder/package.
1. Consume interfaces rather than concrete implementations.
1. Prefer classes for encapsulating functionality and implementing interfaces.
1. Suffix the name of concrete implementations with the name of the implemented interface. Use a prefix that describes the behavior of the implementation, or use a `Default` prefix.

   ```ts
   interface ImageLoader { ... } // interface for loading images

   class DefaultImageLoader implements ImageLoader { /* loads an image */ }
   class CachingImageLoader implements ImageLoader { /* caches loaded images */ }
   class ResizingImageLoader implements ImageLoader { /* resizes loaded images */ }
   ```

1. Keep constructors private, prefer static factory methods for creating instances.

   ```ts
   class DefaultImageLoader implements ImageLoader {
     // Use `create` for the main way to create an instance.
     static create(options?: ImageLoaderOptions) {
       /* ... */
     }

     // If there are multiple different types of instances that can be
     // created, suffix the create method.
     static createWithCaching(options?: ImageLoaderOptions) {
       /* ... */
     }

     // If the instantiation process is based on a specific value, use `from*`.
     // The most common example of this is reading from configuration.
     // Use a second parameter in case additional options are needed.
     static fromConfig(config: Config, deps: { logger: Logger }) {
       /* ... */
     }

     // Other types of values can work too
     static fromUrl(url: URL) {
       /* ... */
     }

     private constructor(/* ... */) {
       /* ... */
     }
   }
   ```

1. Prefer common prefixes over suffixes when naming constants.

   ```ts
   // May be tempting to use `GITHUB_WIDGET_LABEL` instead.
   const WIDGET_LABEL_GITHUB = 'github';
   const WIDGET_LABEL_GITLAB = 'gitlab';
   const WIDGET_LABEL_BITBUCKET = 'bitbucket';
   ```

1. When a type relates directly to other symbols, use the name of those as prefix for the type.

   ```ts
   // Always prefix a prop type with the name of the component.
   function MyComponent(props: MyComponentProps) {}

   // Option types should be prefixed with the name of the operation.
   function upgradeWidget(options: UpgradeWidgetOptions) {}
   function activateWidget(options: ActivateWidgetOptions) {}

   // An exception to this are create methods, where the name of the thing
   // being created may be used as the prefix instead.
   function createWidget(options: WidgetOptions) {}

   // In this case the related names for request types are `ReportsApi` and
   // the method name. If there is a low risk of conflict we can keep them
   // short by only prefixing with the method name, but if there is a higher
   // risk of conflict then we would want to use the full prefix instead, while
   // omitting redundant parts, i.e. `ReportsApiUploadRequest.
   interface ReportsApi {
     uploadReports(request: UploadReportsRequest): Promise<void>;
     deleteReport(request: DeleteReportRequest): Promise<void>;
   }
   ```

1. When there is a significant number of arguments to a function or method, prefer to use a single options object as the argument, rather than many positional arguments.

   ```ts
   // Bad
   function createWidget(id: string, name: string, width: number) {}

   // Good
   function createWidget(options: CreateWidgetOptions) {}
   ```

1. Avoid arrays as return types; prefer response objects.

   ```ts
   interface UserApi {
     // Bad
     // Can only return Users without signaling additional information such as pagination.
     listUsers(): Promise<User[]>;

     // Good
     // Easy to evolve with additional fields.
     listUsers(): Promise<ListUsersResponse>;
   }
   ```

# Documentation Guidelines

We use [API Extractor](https://api-extractor.com/pages/overview/demo_docs/) to generate our documentation, which in turn uses [TSDoc](https://github.com/microsoft/tsdoc) to parse our doc comments.

The doc comments are of the good old `/** ... */` format, with tags of the format `@<tag>` used to mark various things. The [TSDoc website](https://tsdoc.org/) has a good index of all available tags.

There are a few things to pay attention to, in order to make the documentation show up in a nice way on the website...

## Declare exported functions using the `function` keyword

API documenter will not recognize arrow functions as functions, but rather as a constant that shows up in the list of exported variables. By declaring functions using the `function` keyword, they will show up in the list of functions. They will also get a much nicer documentation page for the individual function that shows information about parameters and return types.

This also extends to React components, since API documenter doesn't have any special handling of those. By always defining exported React components using the `function` keyword, we make them show up among the list of functions in the API reference, where they are then easily discoverable through the `(props)` argument (which you should be sure to include!).

![image](https://user-images.githubusercontent.com/4984472/133120461-59d74c3e-ebd9-44f9-900d-cc30f54a3cd2.png)

```ts
/**
 * Properties for {@link ErrorPanel}.
 */
export interface ErrorPanelProps {
  ...
}

/**
 * Renders a warning panel as the effect of an error.
 */
export function ErrorPanel(props: ErrorPanelProps) {
  ...
}
```

## Do not destruct parameters in public function declarations

If the parameters of a function are destructed in the parameter list, they will show up in the documentation like this:

![image](https://user-images.githubusercontent.com/4984472/133117011-3e6cb6da-40dd-450e-8d33-51bdcf412e08.png)

Instead prefer to use a single parameter variable and then move the destructuring into the function body, which will look much nicer:

![image](https://user-images.githubusercontent.com/4984472/133120542-d648de43-5495-43a8-b532-f5e6f6ab736e.png)

Also be sure to check that the type used by the parameter is exported, as it otherwise won't be discoverable through documentation.

## Use `@remarks` to split long descriptions

The API reference has an index of exported symbols for each package, which uses a short description, while clicking through to the page for a symbol shows the full description. By default all descriptions are considered "short", and you have to manually add a divider where the description should be cut off using the `@remarks` tag.

```ts
/**
 * This function helps you create a thing.
 *
 * @remarks
 *
 * Here is a much longer and more elaborate description of how the
 * creation of a thing works, which is way too long to fit on the index page.
 */
function createTheThing() {}
```

## Use `@param` to document parameters

When using the `@param` tag to document a parameter it will show up in the **Parameters** section:

![image](https://user-images.githubusercontent.com/4984472/133120977-64004074-0afb-4e8a-9a2a-c846f04eb3d9.png)

Be sure to include a `-` after the parameter name as well as [required by TSDoc](https://tsdoc.org/pages/tags/param/), or you'll get a warning in the API report.

```ts
/**
 * Generates a PluginCacheManager for consumption by plugins.
 *
 * @param pluginId - The plugin that the cache manager should be created for. Plugin names should be unique.
 */
forPlugin(pluginId: string): PluginCacheManager {
  ...
}
```

## Fill in missing references using `{@link ...}`

Not all types are detected and referenced on the documentation page. Most notably variables, and therefore `ApiRef`s, will not have clickable links to other symbols that they reference. We instead fill in this missing information using inline `{@link ...}` tags in the description:

```ts
/**
 * {@link ApiRef} for the {@link DiscoveryApi}.
 */
export const discoveryApiRef: ApiRef<DiscoveryApi> = createApiRef(...);
```

![image](https://user-images.githubusercontent.com/4984472/133123632-d00cefd9-a70f-43f6-8f14-40c253554ee1.png)
