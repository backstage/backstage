# FAQ

## Product FAQ:

### Can we call Backstage something different? So that it fits our company better?

Yes, Backstage is just a platform for building your own developer portal. We
happen to call our internal version Backstage, as well, as a reference to our
music roots. You can call your version whatever suits your team, company, or
brand.

### Is Backstage a monitoring platform?

No, but it can be! Backstage is designed to be a developer portal for all your
infrastructure tooling, services, and documentation. So, it's not a monitoring
platform — but that doesn't mean you can't integrate a monitoring tool into
Backstage by writing
[a plugin](https://github.com/spotify/backstage/blob/master/docs/FAQ.md#what-is-a-plugin-in-backstage).

### How is Backstage licensed?

Backstage was released as open sourced software by Spotify and is licensed under
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

### Why did we open source Backstage?

We hope to see Backstage become the infrastructure standard everywhere. When we
saw how much Backstage improved developer experience and productivity
internally, we wanted to share those gains. After all, if Backstage can create
order in an engineering environment as open and diverse as ours, then we're
pretty sure it can create order (and boost productivity) anywhere. To learn
more, read our blog post,
"[What the heck is Backstage anyway?](https://backstage.io/blog/2020/03/18/what-is-backstage)"

### Will Spotify's internal plugins be open sourced, too?

Yes, we've already started releasing open source versions of some of the plugins
we use here, and we'll continue to do so.
[Plugins](https://github.com/spotify/faq#what-is-a-plugin-in-backstage) are the
building blocks of functionality in Backstage. We have over 120 plugins inside
Spotify — many of those are specialized for our use, so will remain internal and
proprietary to us. But we estimate that about a third of our existing plugins
make good open source candidates. (And we'll probably end up writing some brand
new ones, too.) ​

### What's the roadmap for Backstage?

​ We envision three phases, which you can learn about in
[our project roadmap](https://github.com/spotify/backstage#project-roadmap).
Even though the open source version of Backstage is relatively new compared to
our internal version, we have already begun work on various aspects of all three
phases. Looking at the
[milestones for active issues](https://github.com/spotify/backstage/milestones)
will also give you a sense of our progress.

### My company doesn't have thousands of developers or services. Is Backstage overkill?

Not at all! A core reason to adopt Backstage is to standardize how software is
built at your company. It's easier to decide on those standards as a small
company, and grows in importance as the company grows. Backstage sets a
foundation, and an early investment in your infrastructure becomes even more
valuable as you grow.

### Our company has a strong design language system/brand that we want to incorporate. Does Backstage support this?

Yes! The Backstage UI is built using Material-UI. With the theming capabilities
of Material-UI, you are able to adapt the interface to your brand guidelines.

## Technical FAQ:

### Why Material-UI?

The short answer is that's what we've been using in Backstage internally.

The original decision was based on Google's Material Design being a thorough,
well thought out and complete design system, with many mature and powerful
libraries implemented in both the system itself and auxiliary components that we
knew that we would like to use.

It strikes a good balance between power, customizability, and ease of use. A
core focus of Backstage is to make plugin developers productive with as few
hurdles as possible. Material-UI lets plugin makers get going easily with both
well-known tech and a large flora of components. ​

### What technology does Backstage use?

​ The code base is a large-scale React application that uses TypeScript. For
[Phase 2](https://github.com/spotify/backstage#project-roadmap), we plan to use
Node.js and GraphQL. ​

### What is the end-to-end user flow? The happy path story.

​ There are three main user profiles for Backstage: the integrator, the
contributor, and the software engineer. ​ The **integrator** hosts the Backstage
app and configures which plugins are available to use in the app. ​ The
**contributor** adds functionality to the app by writing plugins. ​ The
**software engineer** uses the app's functionality and interacts with its
plugins. ​

### What is the use of a "plugin" in Backstage?

​ A Backstage Plugin adds functionality to Backstage. ​

### Do I have to write plugins in TypeScript?

​ No, you can use JavaScript if you prefer. ​ We want to keep the Backstage core
APIs in TypeScript, but aren't forcing it on individual plugins. ​

### How do I find out if a plugin already exists?

​ Before you write a plugin,
[search the plugin issues](https://github.com/spotify/backstage/issues?q=is%3Aissue+label%3Aplugin+)
to see if it already exists or is in the works. If no one's thought of it yet,
great! Open a new issue as
[a plugin suggestion](https://github.com/spotify/backstage/issues/new/choose)
and describe what your plugin will do. This will help coordinate our
contributors' efforts and avoid duplicating existing functionality. ​ In the
future, we will create
[a plugin gallery](https://github.com/spotify/backstage/issues/260) where people
can browse and search for all available plugins. ​

### Which plugin is used the most at Spotify?

​ By far, our most-used plugin is our TechDocs plugin, which we use for creating
technical documentation. Our philosophy at Spotify is to treat "docs like code",
where you write documentation using the same workflow as you write your code.
This makes it easier to create, find, and update documentation. We hope to
release
[the open source version](https://github.com/spotify/backstage/issues/687) in
the future. (See also:
"[Will Spotify's internal plugins be open sourced, too?](https://github.com/spotify/faq#will-spotifys-internal-plugins-be-open-sourced-too)"
above) ​

### Are you planning to have plugins baked into the repo? Or should they be developed in separate repos?

​ Contributors can add open source plugins to the plugins directory in
[this monorepo](https://github.com/spotify/backstage). Integrators can then
configure which open source plugins are available to use in their instance of
the app. Open source plugins are downloaded as npm packages published in the
open source repository. ​ While we encourage using the open source model, we
know there are cases where contributors might want to experiment internally or
keep their plugins closed source. Contributors writing closed source plugins
should develop them in the plugins directory in their own Backstage repository.
Integrators also configure closed source plugins locally from the monorepo. ​

### Any plans for integrating with other repository managers, such as GitLab or Bitbucket?

​ We chose GitHub because it is the tool that we are most familiar with, so that
will naturally lead to integrations for GitHub being developed at an early
stage. ​ Hosting this project on GitHub does not exclude integrations with
alternatives, such as
[GitLab](https://github.com/spotify/backstage/issues?q=is%3Aissue+is%3Aopen+GitLab)
or Bitbucket. We believe that in time there will be plugins that will provide
functionality for these tools as well. Hopefully, contributed by the community!
​ Also note, implementations of Backstage can be hosted wherever you feel suits
your needs best. ​

### Who maintains Backstage?

​ Spotify will maintain the open source core, but we envision different parts of
the project being maintained by various companies and contributors. We also
envision a large, diverse ecosystem of open source plugins, which would be
maintained by their original authors/contributors or by the community. ​ When it
comes to
[deployment](https://github.com/spotify/backstage/blob/master/DEPLOYMENT.md),
the system integrator (typically, the infrastructure team in your organization)
maintains Backstage in your own environment. ​

### Does Spotify provide a managed version of Backstage?

​ No, this is not a service offering. We build the piece of software, and
someone in your infrastructure team is responsible for
[deploying](https://github.com/spotify/backstage/blob/master/DEPLOYMENT.md) and
maintaining it. ​

### How secure is Backstage?

​ We take security seriously. When it comes to packages and code we scan our
repositories periodically and update our packages to the latest versions. When
it comes to deployment of Backstage within an organisation it depends on the
deployment and security setup in your organisation. Reach out to us on
[Discord](https://discord.gg/MUpMjP2) if you have specific queries.

Please report sensitive security issues via Spotify's
[bug-bounty program](https://hackerone.com/spotify) rather than GitHub. ​

### Does Backstage collect any information that is shared with Spotify?

​ No. Backstage does not collect any telemetry from any third party using the
platform. Spotify, and the open source community, does have access to
[GitHub Insights](https://github.com/features/insights), which contains
information such as contributors, commits, traffic, and dependencies. ​
Backstage is an open platform, but you are in control of your own data. You
control who has access to any data you provide to your version of Backstage and
who that data is shared with. ​

### Can Backstage be used to build something other than a developer portal?

​ Yes. The core frontend framework could be used for building any large-scale
web application where (1) multiple teams are building separate parts of the app,
and (2) you want the overall experience to be consistent. ​ That being said, in
[Phase 2](https://github.com/spotify/backstage#project-roadmap) of the project
we will add features that are needed for developer portals and systems for
managing software ecosystems. Our ambition will be to keep Backstage modular. ​

### How can I get involved?

​ Jump right in! Come help us fix some of the
[early bugs and first issues](https://github.com/spotify/backstage/labels/good%20first%20issue)
or reach [a new milestone](https://github.com/spotify/backstage/milestones). Or
write an open source plugin for Backstage, like this
[Lighthouse plugin](https://github.com/spotify/backstage/tree/master/plugins/lighthouse).
​ See all the ways you can
[contribute here](https://github.com/spotify/backstage/blob/master/CONTRIBUTING.md).
We'd love to have you as part of the community. ​

### Can I join the Backstage team?

​ If you're interested in being part of the Backstage team, reach out to
[fossopportunities@spotify.com](mailto:fossopportunities@spotify.com)
