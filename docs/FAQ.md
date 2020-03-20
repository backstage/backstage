# FAQ

## Why Material-UI?

The short answer is that it's what we've been using in Backstage internally.

The original choice is based on Google's material design being a thorough and well
thought out full design system, with many mature and powerful libraries implementing
both the system itself and auxiliary components that we knew that we would like to use.

It strikes a good balance between power, customisability, and ease of use. Since a core
focus of Backstage is to make plugin developers productive with as few hurdles as
possible, material-ui lets plugin makers both get going easily with well-known tech
and a large flora of components.

## Are you planning on having plugins cooked into the repo or should they be developed in separate repos?

Additional open sourced plugins would be added to the `plugins` directory in this monorepo.

While we encourage using the open soure model, integrators that want to experiment with
Backstage internally may also choose to develop closed source plugins in a manner that suits
them best, for example in their respective Backstage source repository.
