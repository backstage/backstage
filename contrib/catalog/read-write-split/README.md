# Catalog Read-Write Split

This article gives an overview of how you might split your catalog deployment into two - one which handles only reads (the read part of the API), and another that handles everything else (the write part of the API, and processing and ingestion etc).

This is useful for several reasons:

- The performance characteristics and scaling needs of those two concerns typically differ significantly
- Moving the bursty processing and ingestion load on a separate deployment can make the important read part of the API have more deterministic response times
- It opens up for easier cross region deployment of read nodes, while having write nodes in a single "home" region
- It also opens up for primary/secondary split of the underlying database, with streaming replication

## Overview

This is a rough overview of what we will go through:

- Ensure that all frontend code uses `catalogApiRef`, and all backend code uses `catalogServiceRef`, for talking to the catalog
- Add a separate discovery name for the write deployment
- Register both frontend and backend implementations of the catalog client that know to send traffic to the right discovery name as needed
- Set up the backend itself with dedicated read and write configuration
- Split the deployment into two
- Follow up with a database split, if desired

## 1. Prerequisite: Establish usage of catalog client refs

First, ensure that all of your code uses _injected_ catalog clients for its catalog communications needs instead of making their own with `new`. For frontend code that means leveraging `catalogApiRef`, and for backend it means leveraging `catalogServiceRef`. This is what enables the sort of wholesale injection of custom behaviors that we are about to do, and is a strongly recommended best practice either way.

- ✅ Search through your projects and ensure that there are no `new CatalogClient` calls. If you find any, consider rewriting that code to instead having the client injected through leveraging the corresponding ref.

- ✅ Search through your projects and ensure that you do _not_ import the `catalogServiceRef` that specifically is in the `@backstage/plugin-catalog-node/alpha` export. That one has been deprecated for a long time and will not be targeted by this guide. If you find any, consider rewriting that code to instead inject the client from `@backstage/plugin-catalog-node` (note the lack of `/alpha`).

> [!TIP]
> If you find usages of `new CatalogClient` in tests, you can normally leave those as-is. You can however consider to later try out the `catalogApiMock` from `@backstage/plugin-catalog-react/testUtils` for frontend tests, and `catalogServiceMock` from `@backstage/plugin-catalog-node/testUtils` for backend tests. These allow you to inject a client that behaves like a complete fake catalog backend with entities in it, without complex mocking.

## 2. Decide your deployment split structure

We will be defining a fake plugin ID called `catalog-write`. In addition to your current single catalog deployment you will add a second one that receives traffic for `catalog-write`. You need to decide upon what your ingress to those two deployments will look like. This is highly company dependent, so we cannot give general guidance.

This guide will however NOT split the code base into two. It will instead change your catalog backend code in such a way that it can support either deployment. This is all very flexible and you can tweak it as you see fit, but that's what worked well for us.

This guide will assume that when all is said and done, requests for the `catalog` plugin ID resolve to the URL `https://catalog-read.example.net/api/catalog`, and requests for the `catalog-write` plugin ID resolve to the URL `https://catalog-write.example.net/api/catalog`. This is just for illustration and you shall change these to their actual correct values at your company.

- ✅ Copy the contents of [the `app-config.yaml` file](./workspace/app-config.yaml) to your own. We will assume that these exact settings are applied both to your frontend and your catalog (read AND write) deployment. For now, if you are applying this guide step by step rather than all at once, you can set the URLs in there to point to your good old pre-split deployment and only update them again after the split.

> [!TIP]
> As a future refactor, you could instead break out this behavior into a custom injected discovery implementation in a library that all your projects can import. That takes a few more steps and is left as a separate exercise. If you already have such a library in your internal NPM, feel free to put it there to begin with and import from there.

## 3. Get split-aware catalog clients in place

Now let's put clients in place whose methods send traffic to either `catalog` or `catalog-write` as needed.

- ✅ Copy [the `catalogApi.ts` file](./workspace/packages/app/src/catalogApi.ts) into your `packages/app/src` directory of the project where you develop your Backstage frontend. Then reference that file's API factory in your `packages/app/src/apis.ts` file, [as illustrated here](./workspace/packages/app/src/apis.ts).

- ✅ Copy [the `catalogService.ts` file](./workspace/packages/backend/src/catalogService.ts) into your `packages/backend/src` directory of the project where you develop your Software Catalog backend. We will reference the file itself in the step below.

After step 4 below is complete, these will be automatically picked up and used by all callers.

> [!TIP]
> As a future refactor, you could instead break out these clients into a node and a react library that all your projects can import. That takes a few more steps and is left as a separate exercise. If you already have such libraries in your internal NPM, feel free to put them there to begin with and import from there.

## 4. Split the catalog backend

We'll now perform the actual split of the catalog backend. You will make separate config files that apply to each, and adapt the backend code to handle both cases seamlessly.

- ✅ Duplicate your deployment. It's highly company dependent how this is done. Some may for example duplicate some declarative `Deployment` and `Service` k8s manifests etc, but it depends.

- ✅ Copy [the `app-config.catalog-read.yaml`] and [the `app-config.catalog-write.yaml`] files into your project root. You must set up your read and write deployments to load their respective files with the `--config` flag, _in addition to_ the `app-config.yaml` file and possibly `app-config.production.yaml` that they already loaded.

- ✅ Copy [the `config.d.ts`](./workspace/config.d.ts) file to your catalog backend directory at `packages/backend`. You should refer to it in the `package.json`'s `"files"` and `"configSchema"` fields [as per usual](https://backstage.io/docs/conf/defining).

- ✅ Update your `packages/backend/src/index.ts` file to match [the proposed structure here](./workspace/packages/backend/src/index.ts). Note how it applies the custom catalog service we copied in the previous step, and has a separate section for write-only concerns.

## 5. Region and database split

After the above is deployed and working, you are well set up for some next step.

- Scaling your readers across multiple regions and add geo-aware routing to them, while keeping writers in a "home" region
- Splitting the database server into a primary that the write nodes connect to, and regional secondaries with streaming replication from the primary

But all of this is left as an exercise for the reader.

## 6. Help make this smoother

Congratulations on successfully performing your split!

We would love [some help](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md) with making this process easier for others. For example, if read nodes could automatically transparently proxy traffic to write nodes as needed, we would need far less fiddling with clients at a relatively small extra cost.
