---
id: product
title: Non-technical FAQ
description: Questions related to product and design.
---

### Can we call Backstage something different? So that it fits our company better?

Yes, Backstage is just a framework for building your own developer portal. We happen to call our internal version Backstage, as well, as a reference to our music roots. You can call your version whatever suits your team, company, or brand.

### Is Backstage a monitoring platform?

No, but it can be! Backstage is designed to be a developer portal for all your infrastructure tooling, services, and documentation. So, it's not a monitoring platform — but that doesn't mean you can't integrate a monitoring tool into Backstage by writing [a plugin](#what-is-a-plugin-in-backstage).

### How is Backstage licensed?

Backstage was released as open source software by Spotify and is licensed under [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

### Why did we open source Backstage?

We hope to see Backstage become the infrastructure standard everywhere. When we saw how much Backstage improved developer experience and productivity internally, we wanted to share those gains. After all, if Backstage can create order in an engineering environment as open and diverse as ours, then we're pretty sure it can create order (and boost productivity) anywhere. To learn more, read our blog post, "[What the heck is Backstage anyway?](https://backstage.io/blog/2020/03/18/what-is-backstage)"

### Will Spotify's internal plugins be open sourced, too?

Yes, we've already started releasing open source versions of some of the plugins we use here, and we'll continue to do so. [Plugins](technical.md#what-is-a-plugin-in-backstage) are the building blocks of functionality in Backstage. We have over 120 plugins inside Spotify — many of those are specialized for our use, so will remain internal and proprietary to us. But we estimate that about a third of our existing plugins make good open source candidates. (And we'll probably end up writing some brand new ones, too.)

### What's the roadmap for Backstage?

We envision three phases, which you can learn about in [our project roadmap](../overview/roadmap.md). Even though the open source version of Backstage is relatively new compared to our internal version, we have already begun work on various aspects of all three phases. Looking at the [milestones for active issues](https://github.com/backstage/backstage/milestones) will also give you a sense of our progress.

### My company doesn't have thousands of developers or services. Is using Backstage excessive for our needs?

Not at all! A core reason to adopt Backstage is to standardize how software is built at your company. It's easier to decide on those standards as a small company, and grows in importance as the company grows. Backstage sets a foundation, and an early investment in your infrastructure becomes even more valuable as you grow.

### Our company has a strong design language system/brand that we want to incorporate. Does Backstage support this?

Yes! The Backstage UI is built using Material UI. With the theming capabilities of Material UI, you are able to adapt the interface to your brand guidelines.

---

### Can we use Backstage if our company has strict security or compliance requirements?

Absolutely. Backstage is designed to be deployed and operated within your own infrastructure, giving you full control over access, security, and compliance. You can integrate with your company’s authentication and authorization systems, and restrict plugin access as needed.

### Is Backstage only for engineering teams, or can other departments benefit?

While Backstage is primarily focused on developer experience, other teams such as operations, security, and documentation can also benefit from a unified portal. Custom plugins can be developed to serve the needs of different departments.

### How much maintenance does Backstage require?

Like any internal tool, Backstage requires maintenance, especially as your organization’s needs evolve. The open source community provides regular updates and security patches, but you should plan for a dedicated team or owner to manage your company’s deployment and plugins.

### Can we integrate our existing tools with Backstage?

Yes. Backstage is designed for extensibility. You can build custom plugins to integrate with your internal tools, or use and customize many of the [existing open-source plugins](https://backstage.io/plugins) for popular services.

### How easy is it to migrate our existing documentation into Backstage?

Backstage supports several documentation formats, including Markdown and MkDocs. Many organizations migrate their docs gradually, using [TechDocs](https://backstage.io/docs/features/techdocs) to centralize and standardize content over time.

### What skills are needed to set up and customize Backstage?

Backstage is built with TypeScript, React, and Node.js. Familiarity with these technologies helps in customization and plugin development, but getting started does not require deep expertise, especially if you use the available guides and templates.

### Does Backstage support internationalization (i18n) and accessibility (a11y)?

Backstage is committed to accessibility and has support for internationalization. Contributions in these areas are welcome, and many plugins strive to meet accessibility standards and provide localization options.

---
