# FAQ

## Q: Why Material-UI?

The short answer is that it's what we've been using in Backstage internally.

The original choice is based on Google's material design being a thorough and well
thought out full design system, with many mature and powerful libraries implementing
both the system itself and auxiliary components that we knew that we would like to use.

It strikes a good balance between power, customisability, and ease of use. Since a core
focus of Backstage is to make plugin developers productive with as few hurdles as
possible, material-ui lets plugin makers both get going easily with well-known tech
and a large flora of components.

## Q: Are you planning on having plugins cooked into the repo or should they be developed in separate repos?

Additional open sourced plugins would be added to the `plugins` directory in this monorepo.

While we encourage using the open source model, integrators that want to experiment with
Backstage internally may also choose to develop closed source plugins in a manner that suits
them best, for example in their respective Backstage source repository.

## Q: Any plans for integrating with other repository managers such as Gitlab or Bitbucket?

We chose Github by the fact that it is the tool that we are most familiar with and that will naturally
lead to integrations for Github specifically being developed in an early stage.

Hosting this project on Github does not exclude integrations with other alternatives such as Gitlab or
Bitbucket. We believe that in time there will be plugins that will provide functionality for these tools
as well. Hopefully contributed by the community.

And note that implementations of Backstage can be hosted wherever you feel suits your needs best.

## Q: Can Backstage by used for other things than developer portals?

Yes. 

The core frontend framework could be used for building any large-scale web application where multiple teams are building separate parts of the app, but you want the overall experience to be consistent.

That being said, in [Phase 2](https://github.com/spotify/backstage#project-roadmap) of the project we will add features that are needed for developer portals and systems for managing software ecosystems. Our ambition will be to keep Backstage modular.

## Q: My company doesn't have thousands of developers. Is Backstage overkill?

Not really. Sure, having something like Backstage gets more important as the number of developers in your company grows. One of the core reasons to adopt Backstage is to help standardise how software is built at your company. Setting guidelines and deciding on standards is easier when your company is smaller.

