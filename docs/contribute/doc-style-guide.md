---
id: doc-style-guide
title: Documentation Style Guide
description: Writing style guidelines for Backstage documentation
---

This page gives writing style guidelines for the Backstage documentation.
These are guidelines, not rules. Use your best judgment, and feel free to
propose changes to this document in a pull request.

For additional information on contributing to the docs, see the
[Contributors Guide](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md#documentation-guidelines).

## Language

Backstage documentation uses U.S. English spelling and grammar.

The documentation site is built with [Docusaurus](https://docusaurus.io/) and
uses standard Markdown with some Docusaurus-specific features like
[admonitions](https://docusaurus.io/docs/markdown-features/admonitions).

## Tone

Backstage documentation should feel approachable, professional, and helpful.
Write as if you are a knowledgeable colleague explaining something to a peer
who is new to the topic but not new to software development.

- **Be friendly but not casual.** Avoid slang, humor that might not translate,
  or overly enthusiastic language. A warm, straightforward tone works best.
- **Be respectful of the reader's time.** Get to the point. If a concept needs
  a longer explanation, provide it, but don't pad content with filler.
- **Be encouraging without being patronizing.** Assume the reader is competent.
  Avoid phrases like "as everyone knows" or "obviously."
- **Be inclusive.** Use gender-neutral language. Avoid cultural references that
  might not be understood globally. Write for an international audience.
- **Be precise.** Use the correct technical terminology for Backstage concepts.
  When introducing a new term, define it on first use.

## Documentation formatting standards

### Use bold for user interface elements

| Do                | Don't           |
| :---------------- | :-------------- |
| Click **Fork**.   | Click "Fork".   |
| Select **Other**. | Select "Other". |

### Use italics to define or introduce new terms

| Do                                          | Don't                                         |
| :------------------------------------------ | :-------------------------------------------- |
| A _plugin_ is a modular extension ...       | A "plugin" is a modular extension ...         |
| These components form the _backend system_. | These components form the **backend system**. |

### Use code style for filenames, directories, and paths

| Do                                             | Don't                                        |
| :--------------------------------------------- | :------------------------------------------- |
| Open the `app-config.yaml` file.               | Open the app-config.yaml file.               |
| Go to the `/plugins` directory.                | Go to the /plugins directory.                |
| Open the `packages/backend/src/index.ts` file. | Open the packages/backend/src/index.ts file. |

### Use code style for inline code and commands

| Do                                                                         | Don't                                                                |
| :------------------------------------------------------------------------- | :------------------------------------------------------------------- |
| The `yarn start` command starts the app.                                   | The "yarn start" command starts the app.                             |
| Run `yarn install` from the project root.                                  | Run "yarn install" from the project root.                            |
| Use single backticks to enclose inline code, for example `const x = true`. | Use bold or italics for inline code, for example **const x = true**. |
| Enclose code samples with triple backticks.                                | Enclose code samples with any other syntax.                          |
| Use meaningful variable names that have context.                           | Use variable names such as `foo`, `bar`, and `baz`.                  |

### Use code style for package names and API references

<!-- vale off -->

| Do                                                               | Don't                                                            |
| :--------------------------------------------------------------- | :--------------------------------------------------------------- |
| Install the `@backstage/core-plugin-api` package.                | Install the @backstage/core-plugin-api package.                  |
| The `createRouter` function creates a new router.                | The createRouter function creates a new router.                  |
| Set the value of the `backend.baseUrl` field in the config file. | Set the value of the "backend.baseUrl" field in the config file. |

<!-- vale on -->

### Use angle brackets for placeholders

Use angle brackets for placeholders. Tell the reader what a placeholder
represents. For example:

```shell
yarn workspace @backstage/plugin-<plugin-name> start
```

### Use the international standard for punctuation inside quotes

| Do                                              | Don't                                           |
| :---------------------------------------------- | :---------------------------------------------- |
| Events are recorded with an associated "stage". | Events are recorded with an associated "stage." |
| The copy is called a "fork".                    | The copy is called a "fork."                    |

## Code snippet formatting

### Don't include the command prompt

| Do             | Don't            |
| :------------- | :--------------- |
| `yarn install` | `$ yarn install` |

### Separate commands from output

Verify that the app is running:

```shell
yarn start
```

The output is similar to this:

```console
[0] webpack output is served from /
[1] Loaded config from app-config.yaml
```

### Use appropriate language tags for code blocks

Use the correct language identifier for fenced code blocks: `ts` or `typescript`
for TypeScript, `yaml` for YAML configuration, `shell` for shell commands,
`console` for command output, and `diff` for changesets.

## Admonitions

Backstage documentation uses
[Docusaurus admonitions](https://docusaurus.io/docs/markdown-features/admonitions)
for callouts. Use `:::note`, `:::tip`, `:::caution`, and `:::danger` as
appropriate.

```markdown
:::note
You can use _Markdown_ inside admonitions.
:::
```

:::note
You can use _Markdown_ inside admonitions.
:::

Use `:::note` for supplementary information, `:::tip` for helpful suggestions,
`:::caution` for potential pitfalls, and `:::danger` for actions that could
cause data loss or security issues.

Keep admonitions short and focused. Each admonition should contain a single,
clear point. If you find yourself writing multiple paragraphs inside an
admonition, consider whether the content belongs in the main text instead.

Avoid stacking multiple admonitions in a row. Too many callouts on a page
dilute their impact and make the content harder to read. If a section has
more than two admonitions, restructure the content so that most of the
information is in regular paragraphs.

## Markdown elements

### Line breaks

Use a single newline to separate block-level content like headings, lists,
images, code blocks, and others. Manually wrap paragraphs in the Markdown
source at a reasonable line length. This makes diffs easier to review and
helps downstream localization.

### Headings and titles

| Do                                                                        | Don't                                                                  |
| :------------------------------------------------------------------------ | :--------------------------------------------------------------------- |
| Use ordered headings to provide a meaningful outline of your content.     | Use headings level 4 through 6 unless absolutely necessary.            |
| Use sentence case for headings. For example, **Extend the catalog model** | Use title case for headings. For example, **Extend The Catalog Model** |
| Use pound signs (`#`) for headings.                                       | Use underlines (`---` or `===`) for headings.                          |

### Paragraphs

| Do                                                          | Don't                                |
| :---------------------------------------------------------- | :----------------------------------- |
| Try to keep paragraphs under 6 sentences.                   | Write long, unbroken walls of text.  |
| Use three hyphens (`---`) for horizontal rules when needed. | Use horizontal rules for decoration. |

### Links

| Do                                                                                                                   | Don't                                                                                      |
| :------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| Write hyperlinks with descriptive text. For example: See [Getting Started](../getting-started/index.md) for details. | Use ambiguous link text. For example: See [here](../getting-started/index.md) for details. |
| Write Markdown-style links: `[link text](./index.md)`.                                                               | Write HTML-style links or create links that open in new tabs.                              |

### Lists

- End each item in a list with a period if one or more items in the list are
  complete sentences. For consistency, either all items or none should be
  complete sentences.
- Use the number one (`1.`) for ordered lists.
- Use (`-`) for unordered lists.
- Leave a blank line after each list.
- Indent nested lists with two spaces.

### Tables

Use Markdown tables with clear column headers. Keep table content concise.
For large amounts of structured data, consider using a list or separate
subsections instead.

## Content best practices

### Spell out acronyms on first use

When using an acronym, spell it out in full on first use followed by the
acronym in parentheses. After that, you can use the acronym alone.

| Do                                                      | Don't                                 |
| :------------------------------------------------------ | :------------------------------------ |
| Software Development Kit (SDK)                          | SDK (without ever defining it)        |
| Role-Based Access Control (RBAC) ... configure RBAC ... | RBAC ... configure RBAC ...           |
| Hyper Text Markup Language (HTML)                       | HTML (on first use without expansion) |

Exception: Universally understood acronyms like URL, API, or HTML do not
need to be spelled out if they are common knowledge for the target audience
of software developers.

### Use present tense

| Do                                  | Don't                                   |
| :---------------------------------- | :-------------------------------------- |
| This command starts a proxy.        | This command will start a proxy.        |
| The plugin provides a catalog page. | The plugin will provide a catalog page. |

Exception: Use future or past tense if it is required to convey the correct
meaning.

### Use active voice

| Do                                       | Don't                                       |
| :--------------------------------------- | :------------------------------------------ |
| You can explore the API using a browser. | The API can be explored using a browser.    |
| The YAML file specifies the base URL.    | The base URL is specified in the YAML file. |

Exception: Use passive voice if active voice leads to an awkward construction.

### Use simple and direct language

| Do                          | Don't                                                    |
| :-------------------------- | :------------------------------------------------------- |
| To create a plugin, ...     | In order to create a plugin, ...                         |
| See the configuration file. | Please see the configuration file.                       |
| View the catalog entities.  | With this next command, we'll view the catalog entities. |

### Address the reader as "you"

| Do                                       | Don't                                   |
| :--------------------------------------- | :-------------------------------------- |
| You can create a plugin by ...           | We'll create a plugin by ...            |
| In the preceding output, you can see ... | In the preceding output, we can see ... |

### Avoid Latin phrases

Prefer English terms over Latin abbreviations.

| Do               | Don't     |
| :--------------- | :-------- |
| For example, ... | e.g., ... |
| That is, ...     | i.e., ... |

Exception: Use "etc." for and so on.

## Patterns to avoid

### Be intentional with "we"

"We" is fine in tutorials and walkthroughs where it means "you and I, working
through this together." Avoid "we" when it's unclear whether it refers to the
Backstage project, the maintainers, or the reader's team.

| Ok                                          | Avoid                              |
| :------------------------------------------ | :--------------------------------- |
| Next, we need to add the backend package.   | We provide a new feature ...       |
| We can verify this by running `yarn start`. | In version 1.25, we have added ... |

### Avoid jargon and idioms

Some readers speak English as a second language. Avoid jargon and idioms to
help them understand better.

| Do                   | Don't                 |
| :------------------- | :-------------------- |
| Internally, ...      | Under the hood, ...   |
| Create a new plugin. | Spin up a new plugin. |

### Avoid statements about the future

Avoid making promises or giving hints about the future. If you need to talk
about an experimental feature, clearly label it as such.

### Avoid statements that will soon be out of date

Avoid words like "currently" and "new." A feature that is new today might not
be considered new in a few months.

| Do                              | Don't                               |
| :------------------------------ | :---------------------------------- |
| In version 1.25, ...            | In the current version, ...         |
| The search feature provides ... | The new search feature provides ... |

### Avoid words that assume a specific level of understanding

Avoid words such as "just", "simply", "easy", "easily", or "simple". These
words do not add value.

| Do                         | Don't                           |
| :------------------------- | :------------------------------ |
| Include one command in ... | Include just one command in ... |
| Run the container ...      | Simply run the container ...    |
| You can remove ...         | You can easily remove ...       |
| These steps ...            | These simple steps ...          |

## Backstage word list

A list of Backstage-specific terms and words to be used consistently across
the site.

| Term               | Usage                                                                                                                                  |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------- | --- |
| Backstage          | Always capitalized.                                                                                                                    |
| plugin             | Lowercase when referring to the concept. Use code style when referring to a specific package, for example `@backstage/plugin-catalog`. |
| Software Catalog   | Capitalized as a product name. Use "catalog" (lowercase) when referring to the concept generically.                                    |
| Software Templates | Capitalized as a product name.                                                                                                         |
| TechDocs           | One word, camel case.                                                                                                                  |
| Scaffolder         | Capitalized as a product name.                                                                                                         |
| app-config         | Use code style: `app-config.yaml`.                                                                                                     |
| open source        | Two words, lowercase (unless starting a sentence).                                                                                     |
| backend system     | Lowercase when referring to the Backstage backend framework.                                                                           |     |
