---
id: faq
title: Catalog FAQ
sidebar_label: FAQ
description: This page answers frequently asked questions about the catalog
---

This page answers frequently asked questions about the catalog.

## Is it all that important to have users and groups in the catalog at all?

Yes. One of the most important concepts in the catalog is that it exposes your org structure and ownership properly, allowing your users to effectively understand and communicate around your systems. Having catalog entries for users and groups enables end users to navigate around Backstage and click on those owners and being presented with rich information pages around them, instead of getting 404 Not Found pages.

## Can I create users in the catalog on-demand as they sign in?

When standing up a new Backstage instance, adopters are faced with the realization that the catalog tends to have interactions with sign-in. Therefore the question often comes up, whether it's doable to have users pop up in the catalog on-demand only as they sign in.

This should really be avoided. Our general guidance is to set up a proper integration upfront with your authority for organizational data ([LDAP](../../integrations/ldap/org.md), [Azure](../../integrations/azure/org.md), bespoke HR systems, etc) and batch ingest _all_ users and groups from there into the catalog, whether they sign in or not. This tends to give the superior experience for users, with the smallest amount possible of complexity and frustration.

To give some background, [signing in](../../auth/index.md) technically only requires the `auth` backend which supports the flows that establish who the current user is. At the end of that process, a so called [sign-in resolver](../../auth/identity-resolver.md) is tasked with translating the third party established identity (for example the attributes returned for your AD entry) into a Backstage identity. This important step is made much simpler if the catalog is populated with users and groups from that same third party, because identities line up trivially and you can use the out-of-the-box provided sign-in resolvers for it. As a side note, you can also write your own resolver that does not interact with the catalog at all if you so desire, but let's assume that you do not chose this advanced option.

Doing on-demand user creation _is_ technically possible by writing custom [entity providers](./external-integrations.md). But it comes with significant problems both for technical and end user quality of life reasons.

On the technical side, this is unwanted complexity. You need to implement and maintain a custom provider, instead of what usually amounts to a very easily set-up batch ingestion schedule with providers that come out of the box. Also even if you do this, the catalog is an eventually consistent engine. The user that the provider feeds into the system is not guaranteed to appear immediately. Your experience will likely be only partially functional at bootstrapping time which may have unwanted side effects.

On the user experience side, a Backstage experience without complete organizational data is a serious hindrance to getting the full power out of the tool. Your users won't be able to click on owners and seeing who they are and what teams they belong to. They won't be able to find out what the communications paths are when they need to reach you or your managers when something goes wrong or they have a feature request. They can't get an overview of what teams own and how they relate to each other. It will be a much more barren experience. Organizational data is highly valuable to have centrally available, complete and correct.

## Can I call the catalog itself from inside a processor / provider?

While it's possible to get hold of a catalog client via the `catalogServiceRef` from `@backstage/plugin-catalog-node`, it's almost never the right thing to do, and we strongly discourage from doing so.

The catalog processing loop is a very high-speed system where your entire catalog cluster collaborates to race through all entities at the highest possible rate. The ideal processor does an absolute minimum of work, and immediately relinquishes control back. Performing asynchronous requests to external systems - including the catalog - from processors, can quickly become overwhelming for that external system and starve their resources if they aren't prepared to deal with very high rates of small requests. It also significantly slows down the procesing loop, when each step needs to wait for responses. This can lead to work "piling up" in the catalog and delays in seeing entities get updated. The [life of an entity](./life-of-an-entity.md) article shows the sequence of events that happen when an entity goes from original ingestion, through processing, and to becoming final entities.

See also [the related validation topic](#can-i-validate-relations-in-processors).

## Can I validate relations in processors?

Processors are responsible for generating relations from the entity body - see the [life of an entity](./life-of-an-entity.md) article for more details. It's tempting to put rules in your processors that mark entities as invalid if they have a relation to some other entity that does not exist. For example, a `Component` entity that declares a `spec.owner` to a team that has been disbanded. We strongly discourage from doing this type of "hard" validation in processors, for two reasons.

First, performance. As is described [here](#can-i-call-the-catalog-itself-from-inside-a-processor--provider), you should avoid calling out to the catalog for any reason in processors, including for checking whether a target entity exists. Besides the performance issues, it can also lead to data races where hidden dependencies between entities lead to them never properly settling, or flickering back and forth between states for hard-to-debug reasons.

Second, user experience. The catalog is an eventually consistent system that constantly tries to mirror external realities. Users make changes in catalog-info files, or things update in external systems, and those changes get streamed in and settle over time inside the catalog. But throwing an error in a processor, instantly aborts processing of that entity and stops its ingestion. Now imagine being a large organization where these changes happen maybe hundreds of times per day. Owners of catalog-info files will constantly be surprised by their files "breaking" in ingestion, maybe a very long time after they were initially created - they were valid at their time of creation and haven't been touched since! This is very frustrating and slows down your users because things break silently for reasons out of your control.

There are cases where it's fine to throw hard validation errors in processors. Notably, when it doesn't pass a schema test at all and readers of the catalog data will break if the data was let through. Setting the owner to be a number instead of a string could be such an example.

## Can I throw errors when validating entities?

In short: Sometimes. Only if the shape is so wrong that it would not even parse, or violates TypeScript and similar contracts.

Never throw errors due to "soft" errors, in particular relations not matching an existing target ([see above](#can-i-validate-relations-in-processors)). For soft errors, we recommend instead letting them through into the catalog, and then implementing the checks externally and nudging people gently toward fixing their own metadata. A dynamic info bar at the top of an entity page that informs the owners as they visit the page that a certain relation seems wrong and should be fixed, can go a very long way.

To a large degree, this boils down to user experience. The catalog is an eventually consistent system that constantly tries to mirror external realities. Users make changes in catalog-info files, or things update in external systems, and those changes get streamed in and settle over time inside the catalog. But throwing an error in a processor, instantly aborts processing of that entity and stops its ingestion. Now imagine being a large organization where these changes happen maybe hundreds of times per day. Owners of catalog-info files will constantly be surprised by their files "breaking" in ingestion, maybe a very long time after they were initially created - they were valid at their time of creation and haven't been touched since! This is very frustrating and slows down your users because things break silently for reasons out of your control.

You can throw for "hard" errors such as when the basic expectations of the entity shape are broken, for example, if a [`metadata.annotations` value](./descriptor-format.md#annotations-optional) was an array instead of a string. That does not match the TypeScript contract, and if you accepted such an entity into the catalog, readers of those entities are likely to explode when trying to perform string operations on that value.

## Can I represent versions (of APIs, services etc) in the catalog?

We do not recommend trying to represent fine grained versions in the catalog. It does not have builtin facilities for that (by design), and the alternatives that exist for trying to do so anyway, end up being awkward and have significant drawbacks. You can sometimes represent major, breaking versions as separate entities (more on that below).

This response can seem surprising, but there's a clear intent behind it. Catalog entities generally represent the "human concept" of a thing, rather than the exact technical implementation of it. The name and granularity of entries in the catalog often match the way that you think and speak of that thing when talking to others. Then, you attach plugins to that high level concept, that are responsible for showing all of the finer details about it that your users need.

The catalog should contain _rarely changing_, _human curated_ data that is easily overseen and _managed by the owners_ of those entities.

One example is backend services. In a fast moving world, there may be several versions of a service deployed in several environments at the same time, and those can change rapidly. Despite that, when you talk about the service with your colleagues, you probably call it e.g. "the scaffolder". So you catalog it for example as `kind: Component`, `name: scaffolder`, `type: service`. But in your frontend, you can still have rich plugins that directly query your CI/CD systems, log collectors, and similar, to show precise, real-time information about exactly what's going on in your infrastructure in terms of that service. And notably, this happened without putting the burden on your end users to maintain a complex, fast moving set of yaml data just in order to appease those views.

Another example is software libraries. It's tempting to catalog every dependency of every software component, but it's ultimately not a good fit for the catalog. If you develop inner-source libraries that are widely used in your org, then by all means make a single component for them! That lets people search for it, find the owners, and gain similar insights. But if you want to track individual versions and their usages within the ecosystem, then that's a use case better served by a separate solution. Which then, in turn, absolutely could have a nice plugin view in Backstage so that you can see its output right in the view of the library itself!

And finally the example of APIs. This topic can sometimes be the most contentious. It would be unfortunate to have to create entities for every iteration of your API, and it would clobber search and ultimately be confusing.

Especially for APIs, but also the other kinds, you can still end up wanting to make a new catalog entity when a new major version of that thing is released. At that point, in some cases, the new major version is almost like a completely new component, deployed in isolation from the old one, with completely updated contracts, maybe with different documentation etc. If so then sure, make a `kind: API`, `name: customerinfo2` for example. Then you make the choice that there will be two entities popping up in search results when looking for that string, and maybe that is a good thing in this instance.
