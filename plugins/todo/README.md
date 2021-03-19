# @backstage/plugin-todo

This plugin lists `// TODO` comments in source code. It currently exports a single component extension for use on entity pages.

## Format

The default parser uses [Leasot](https://github.com/pgilad/leasot), which supports a wide range of languages. By default it supports the `TODO` and `FIXME` tags, along with `@` prefix and author reference through with either a `(<name>)` suffix or trailing `/<name>`. For more information on how to configure the parser, see `@backstage/plugin-todo-backend`.

Below are some examples of formats that are supported by default:

```ts
// TODO: Ideally this would be working

// TODO(Rugvip): Not sure why this works, investigate

// @todo: This worked last Monday /Rugvip

// FIXME Nobody knows why this is here
```

Note the trailing comments are not supported, the following TODO would not be listed:

```ts
function reverse(str: string) {
  return str.reverse(); // TODO: optimize
}
```

The scanner also ignores all dot-files and directories, meaning TODOs inside of those will not be listed.

## Extensions

| name                | description                                                                     |
| ------------------- | ------------------------------------------------------------------------------- |
| `EntityTodoContent` | Content for an entity page, showing a table of TODO items for the given entity. |
