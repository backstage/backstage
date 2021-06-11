---
id: concepts
title: Search Concepts
description: Documentation on Backstage Search Concepts
---

# Search Concepts

Backstage Search lets you find the right information you are looking for in the
Backstage ecosystem.

To get started, you should get familiar with these core concepts:

- [Search Engines](#search-engines)
- [Query Translators](#query-translators)
- [Documents and Indices](#documents-and-indices)
- [Collators](#collators)
- [Decorators](#decorators)
- [The Scheduler](#the-scheduler)
- [The Search Page](#the-search-page)
- [Search Context and Components](#search-context-and-components)

### Search Engines

Backstage Search isn't a search engine itself, rather, it provides an interface
between your Backstage instance and a Search Engine of your choice. More
concretely, a `SearchEngine` is an interface whose concrete implementations
facilitate communication with different search engines (like ElasticSearch,
Lunr, Solr, etc). This abstraction exists in order to support your
organization's needs.

Out of the box, Backstage Search comes pre-packaged with an in-memory search
engine implementation built on top of Lunr.

### Query Translators

Because you can bring your own search engine, and because search engines have
very unique and robust query languages themselves, there needs to be a
translation layer between an abstract search query (containing search terms,
filters, and document types) into a concrete search query that is specific to a
search engine.

Search Engines come pre-packaged with simple translators that do rudimentary
transformations of search terms and filters, but you may want to provide your
own to help tune search results in the context of your organization.

### Documents and Indices

"Document" is an abstract concept representing something that can be found by
searching for it. A document can represent a software entity, a TechDocs page,
etc. Documents are made up of metadata fields, at a minimum including a title,
text, and location (as in a URL).

An index is a collection of such documents of a given type.

### Collators

You need to be able to search something! Collators are the way to define what
can be searched. Specifically, they're classes which return documents conforming
to a minimum set of fields (including a document title, location, and text), but
which can contain any other fields as defined by the collator itself. One
collator is responsible for defining and collecting documents of a type.

Some plugins, like the Catalog Backend, provide so-called "default" collators
which you can use out-of-the-box to start searching across Backstage quickly.

### Decorators

Sometimes you want to add extra information to a set of documents in your search
index that the collator may not be aware of. For example, the Software Catalog
knows about software entities, but it may not know about their usage or quality.

Decorators are classes which can add extra fields to pre-collated documents.
This extra metadata could then be used to bias search results or otherwise
improve the search experience in your Backstage instance.

### The Scheduler

There are many ways a search index could be built and maintained, but Backstage
Search chooses to completely rebuild indices on a schedule. Different collators
can be configured to refresh at different intervals, depending on how often the
source information is updated.

### The Search Page

Search pages are very custom things. Not every Backstage instance will want the
same interface! In order to allow you to customize your search experience to
your heart's content, the Search Plugin takes care of state management and other
search logic for you, but most of the layout of a search page lives in a search
page component defined in your Backstage App.

For an example of a simple search page, check
[getting started](./getting-started.md#adding-search-to-the-frontend)

### Search Context and Components

A search experience, like a page, is composed of any number of search
components, which are all wired up using a search context.

Each search experience's context consists of details like a search term,
filters, types, results, and a page cursor for handling pagination. Different
components use this context in different ways. For example, the `<SearchBar />`
can set the search term, `<SearchFilter />` components can set filters, and
search results can be displayed using the `<SearchResult />` component.

The `<SearchResult />` and `<SearchFilter />` components are special, in that
they themselves are extensible. For an example of how to extend these
components, check
[getting started](./getting-started.md#adding-search-to-the-frontend).

If you need even more customization, you can use the search context like any
other React context to create custom search components of your own.
