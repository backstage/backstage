<!-- This document is meant to solely serve as reference for how to write glossary entries. -->

## Entry format

A glossary entry should consist of two required things and two optional things,

1. a header,
2. a sentence defining what the thing is, and
3. an optional additional sentence or two giving more context into what the thing is and possible pointers on where to find more information, and possibly
4. links out to additional information.

### The header

The header (and first sentence) are the way users will discover your entry. The header has two parts,

1. The actual term, this should be as minimal as possible. You can fit more information into the body of the entry.
2. A disambiguator, this allows users to understand when certain entries are context specific or may have different meanings in different contexts.

### The term

Think of this as a dictionary. Single words are the base units and most definitions refer to a single word. Acronyms are acceptable. An adjective and a noun are also useful, `conditional decision`, `backstage framework`, etc. After 3 or _maybe_ 4 words, you should be trying to simplify and place more content in your entry instead.

In the title, your term should be in Title Case. It should also be in the singular.

### The disambiguator

The goal of a disambiguator is to differentiate terms that may have context specific meanings. This can have two interpretations, either

1. There are multiple terms and we need to create clear boundaries between their contexts, or
2. There are single terms that have meanings that are specific to a single context.

A good example for the first would be resources. Both the catalog plugin and permission plugin have the idea of resources, but they do not refer to the same thing.

A good example for the second would be `Query translators`. In our case, this refers to _search_ query translators, but it may refer to database query translators or the latter. By disambiguating early, we avoid confusion.

Beyond the above advice, there are no strong rules for when or when not to use a disambiguator. It is up to the entry writer and the reviewer.

Your disambiguator should be short, but need not be a single word -- examples include "use cases", "search plugin", "catalog plugin". When used the disambiguator should have the following form, `({disambiguator})` (a parenthesis enclosed term) and will sit to the right of the title. Your disambiguator should use lower case.

### Putting it together

Your title should look like `{word} ({disambiguator})`. Entries are not nested besides the disambiguator and should sit at `##`.

## The first sentence

Your first sentence should include the what for your word. Your goal should be to answer the question, "What is x?". Do _not_ use the word in your first sentence. If you are using other words in the glossary in your definition, you should reference them following [the Referencing section](#referencing).

If you have a term that could mean multiple things in the same context or the context is difficult to add boundaries for, you should separate each meaning into a separate section of the entry using an ordered list. For example,

```md
## Bundle

1. A deployment artifact.
2. A collection of packages.
```

## Additional sentences

You may not be able to fully define what you want in a single sentence. Use more sentences to flush out the meaning; however, if you start to get into the weeds, you should reconsider rehousing that information into a plugin specific "concepts" section. It's okay for words to be duplicated across both if the concepts section adds meaningful technical or architectural discussion.

## Linking out to additional resources

If the term you're defining has a better or more in depth source for that information, link to it. This can include plugin specific concept documents, external documentation, or core framework documentation.

You should format these links as

```md
See [the glossary](./glossary.md) for more details.
```

. Additional links beyond the first one should be appended with `and` or `or` as necessary.

## Putting it all together

```md
## Component (catalog plugin)

A software product that is managed in the Backstage [Software Catalog](#software-catalog). A component can be a service, website, library, data pipeline, or any other piece of software managed as a single project. See [the catalog docs](https://backstage.io/docs/features/software-catalog/system-model) for more information.
```

## Referencing

### In the glossary

You should reference often. Words are defined recursively, especially in tech and un-nesting some terms requires additional glossary items. It's okay if your terms require multiple other terms to build on. Your goal with referencing is to provide small reusable words that you can trust users know the definition of.

### In the text

You should reference (and create a new entry if it doesn't exist) whenever you see a new word that a reasonable reader may not know. If you've already added a reference in your current passage -- in the glossary this will be your entry -- don't add a new reference. References should point initially to the glossary and if there is additional information (like a concepts page), the glossary should have a link to that page.
