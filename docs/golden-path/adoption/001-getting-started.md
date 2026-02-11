---
id: getting-started
sidebar_label: 001 - Getting started
title: Getting started with Backstage
---

The adoption journey is a bit different than the other Golden Paths. The goal of this guide is to prepare you for a successful implementation of Backstage in your organization. A technical understanding of Backstage is not needed for this Golden Path, just a desire to help the technical team that will be owning your Backstage instance.

:::info

I'd highly recommend poking around https://demo.backstage.io/ before continuing with this guide. It's a test instance of Backstage that provides a good foundation for what to expect from the tool as a user.

:::

## What is Backstage?

At a high level, Backstage is a framework for building developer portals. When implemented successfully, it can reduce toil for your developers by centralizing information like docs and ownership, reducing cognitive overhead due to tool fragmentation and simplify setting up new codebases or integrating with existing ones.

A few examples,

> My company tracks everything with spreadsheets. We have a list of all Github repos and who owns them, but it's becoming more and more of an issue to keep up to date. Teams aren't proactively updating it when new projects are created and it quickly falls out of date with reorgs and team charter changes.

Backstage can help! We provide a core plugin called Software Catalog that automates this process. Teams are asked to maintain a file in their repo with this ownership information and it gets automatically ingested into Backstage where you can view all projects in a single location.

> My developers have been complaining recently about having to use a growing number of different websites and tools in their day to day. It's getting hard to keep track of all of the tools and for those that we don't use frequently, we lose X minutes trying to remember how to access them.

Tool fragmentation is a real issue and Backstage can also help here! You can create plugins tailored for your company that talk to these external services. These plugins can be standalone or integrated with the Software Catalog for better context. Imagine all of your [CI/CD workflows visible directly](https://backstage.io/plugins/) on the page for your team's projects.

It's important to note that Backstage shouldn't be fully replacing these tools, we don't want to reinvent the wheel. The goal is to have all of the really important information in one place. The tool should still be where teams go to do more advanced or in depth work.

> We have been struggling recently with getting teams to use a standard template for new services. There's no standard set of libraries these services are using or standard infra management. It's increasingly difficult as a platform team to manage everything.

Backstage can help here too! The Scaffolder provides a templating framework that you can plug a Golden Path implementation to. Similar to Github template repos, this can provide a standard base for teams to create based off of.

> Our platform teams have been getting more and more support requests to help debug onboarding steps. We've documented these areas really well and there are plenty of examples in Git, but teams keep running into the same issues. It's always either a bad copy paste or they forget to update a template variable. We've started looking into a custom templating solution for this.

Backstage can help! With the Scaffolder, you can create a template that lets users fill in data through a form and uses that data to create a customized template output. This output is usually in the form of PRs to your various source control systems. Imagine you have a repo for traffic configuration, another for infrastructure management and a third for k8s manifests - with the Scaffolder, you can hide all of this complexity. You may still need to get reviews on the output PRs, but no more copy paste issues!

## What does adopting Backstage look like?

a.k.a "what am I signing myself up for?"

Successfully adopting Backstage usually looks something like this,

1. Setting up a PoC.
2. Getting leadership buy-in.
3. Identify a group of key stakeholders for the project and iterate with them aggressively.
4. Launch to the larger organization.
5. Drive Catalog adoption to 100%.
6. Your Backstage implementation starts to receive plugins from developers outside of your team.

A truly successful Backstage implementation bridges delivering value to customers (developers), demonstrating returns to leadership, and fostering an inner source model. It's a long process but has huge dividends for those that achieve it!

## Getting started

Now that you know what to expect, let's walk through how to get started.

:::note

If you're non-technical, it is highly recommended to find a technical partner for help setting up a proof-of-concept for feedback.

:::

### Software Catalog

Let's go to https://demo.backstage.io/ together. When you first navigate to the page, you will brought to the Software Catalog page. This is a view of all projects currently registered with the (Demo) Backstage instance. There are a series of filters that you can play around with. If you're _really_ interested, we recommend reading through [the software catalog system model](../../features/software-catalog/system-model.md).

Let's click into a Component, say "artist-lookup". This will bring you to a specialized view for that Component. Across the top, you can see tabs for "CI/CD", "API", "Dependencies", "Docs" and "TODOs". For your company, you can change this as you see fit. The important takeaway is that all of these tabs are automatically filtered for this Component which makes it easy to see how this could start to replace many navigation to other tools.

### Scaffolder

Let's go to https://demo.backstage.io/create now. This is the Scaffolder, a place to store reusable templates. Click the "Choose" button in the "Demo template". This will bring you to a form with some information to input. You don't need to fill this out. The main takeaway here is that this form is generated from YAML and doesn't require a frontend team to implement a custom form for each template you want to create.
