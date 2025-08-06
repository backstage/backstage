import{j as r}from"./jsx-runtime-Cw0GR0a5.js";import{A as s}from"./ApiProvider-DlKBPm-W.js";class t{constructor(e){this.apis=e}static from(...e){return new t(new Map(e.map(([i,o])=>[i.id,o])))}get(e){return this.apis.get(e.id)}}const a=n=>r.jsx(s,{apis:t.from(...n.apis),children:n.children});a.__docgenInfo={description:`The \`TestApiProvider\` is a Utility API context provider that is particularly
well suited for development and test environments such as unit tests, storybooks,
and isolated plugin development setups.

It lets you provide any number of API implementations, without necessarily
having to fully implement each of the APIs.

@remarks
todo: remove this remark tag and ship in the api-reference. There's some odd formatting going on when this is made into a markdown doc, that there's no line break between
the emitted <p> for To the following </p> so what happens is that when parsing in docusaurus, it thinks that the code block is mdx rather than a code
snippet. Just omitting this from the report for now until we can work out how to fix later.
A migration from \`ApiRegistry\` and \`ApiProvider\` might look like this, from:

\`\`\`tsx
renderInTestApp(
  <ApiProvider
    apis={ApiRegistry.from([
      [identityApiRef, mockIdentityApi as unknown as IdentityApi]
    ])}
  >
   ...
  </ApiProvider>
)
\`\`\`

To the following:

\`\`\`tsx
renderInTestApp(
  <TestApiProvider apis={[[identityApiRef, mockIdentityApi]]}>
    ...
  </TestApiProvider>
)
\`\`\`

Note that the cast to \`IdentityApi\` is no longer needed as long as the mock API
implements a subset of the \`IdentityApi\`.

@public`,methods:[],displayName:"TestApiProvider",props:{apis:{required:!0,tsType:{name:"unknown"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};export{a as T,t as a};
