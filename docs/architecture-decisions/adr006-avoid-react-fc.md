# ADR006: Avoid React.FC

## Context

Facebook has removed ```React.FC``` from their base template for a Typescript project. The reason for this was that it was found to be an unnecessary feature with next to no benefits in combination with a few downsides.

The main reasons were:
- **children props** were implicitly added
- **Generic Type** lacked support

## Decision

To keep our codebase up to date, we have decided that React.FC should be avoided in our codebase when adding new code.

Here is an example:
````
type MyType = { text: string }

// avoid React.FC
const ComponentWithReactFC = React.FC<MyType> = ({text} => <div>{text}</div>)

// do this instead
const ComponentWithoutReactFC = ({text} : MyType) => <div>{text}</div>
````

## Consequences

We will gradually remove the current usage of React.FC from our codebase.
