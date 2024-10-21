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

Any backend module, including those that provide processors and entity providers to the catalog, are technically able to get hold of a catalog client via the `catalogServiceRef` from `@backstage/plugin-catalog-node`. However, it is almost never the right thing to do - especially from processors - and we strongly discourage from doing so.

The catalog processing loop is a very high-speed system where your entire catalog cluster collaborates to race through all entities at the highest possible rate. The ideal processor does an absolute minimum of work, and immediately relinquishes control back. Performing asynchronous requests to external systems - including the catalog - from processors, can quickly become overwhelming for that external system and starve their resources if they aren't prepared to deal with very high rates of small requests. It also significantly slows down the procesing loop, when each step needs to wait for responses. This can lead to work "piling up" in the catalog and delays in seeing entities get updated. The [life of an entity](./life-of-an-entity.md) article shows the sequence of events that happen when an entity goes from original ingestion, through processing, and to becoming final entities.

See also [the related validation topic](#can-i-validate-relations-in-processors).

## Can I validate relations in processors?

Processors are responsible for generating relations from the entity body - see the [life of an entity](./life-of-an-entity.md) article for more details. It's tempting to put rules in your processors that mark entities as invalid if they have a relation to some other entity that does not exist. For example, a `Component` entity that declares a `spec.owner` to a team that has been disbanded. We strongly discourage from doing this type of "hard" validation in processors, for two reasons.

First, performance. As is described [here](#can-i-call-the-catalog-itself-from-inside-a-processor--provider), you should avoid calling out to the catalog for any reason in processors, including for checking whether a target entity exists. Besides the performance issues, it can also lead to data races where hidden dependencies between entities lead to them never properly settling, or flickering back and forth between states for hard-to-debug reasons.

Second, user experience. The catalog is an eventually consistent system that constantly tries to mirror external realities. Users make changes in catalog-info files, or things update in external systems, and those changes get streamed in and settle over time inside the catalog. But throwing an error in a processor, instantly aborts processing of that entity and stops its ingestion. Now imagine being a large organization where these changes happen maybe hundreds of times per day. Owners of catalog-info files will constantly be surprised by their files "breaking" in ingestion, maybe a very long time after they were initially created - they were valid at their time of creation and haven't been touched since! This is very frustrating and slows down your users because things break silently for reasons out of your control.

There are cases where it's fine to throw hard validation errors in processors. Notably, when it doesn't pass a schema test at all and readers of the catalog data will break if the data was let through. Setting the owner to be a number instead of a string could be such an example.
