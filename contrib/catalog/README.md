# Catalog Contrib

This directory contains various community contributions related to [the Backstage catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview).

There is no guarantee of correctness or fitness of purpose of these
contributions, but we hope that they are helpful to someone!

Installation instructions are generally in the doc comment on top of each class.

## ImmediateEntityProvider

Sometimes we get requests for the ability to POST/PUT entities directly to the
catalog, instead of its regular mode of operation where it pulls data from
authoritative sources itself.

The core product does not intend to support this use case, since it comes with a
number of caveats. However, this entity provider demonstrates how to build a
very basic version of such functionality yourself. It does not offer any
protection from misuse, but can serve as a good starting point to build out such
a provider yourself, fit for your particular needs.

## LoadTestingEntityProvider

This is a trivial little test bed entity provider that lets you make huge batch
operations and get some timings back. It also tries to clean up after itself
when it's done. This can be useful if you are working on optimizing the catalog
itself, or on processors or similar that you add to it.
