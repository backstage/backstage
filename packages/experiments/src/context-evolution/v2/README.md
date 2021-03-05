This is the first evolution.

The only thing it does is to set the method `getPlugins` deprecated.

Notice the real impl is in v2, so the process here is:

- copy v1 to v2.
- implement the changes in v2.
- reimplement v1 based on v2.

Also, notice users of v1 will still get the deprecation notice for the `getPlugins` (check implV1.tsx).