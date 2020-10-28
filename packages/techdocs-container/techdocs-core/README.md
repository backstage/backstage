# techdocs-core

This is the base [Mkdocs](https://mkdocs.org) plugin used when using Mkdocs with Spotify's TechDocs. It is written in Python and packages all of our Mkdocs defaults, such as theming, plugins, etc in a single plugin.

[Python Package](https://pypi.org/project/mkdocs-techdocs-core/)

## Usage

```bash
$ pip install mkdocs-techdocs-core
```

Once you have installed the `mkdocs-techdocs-core` plugin, you'll need to add it to your `mkdocs.yml`.

```yaml
site_name: Backstage Docs

nav:
  - Home: index.md
  - Developing a Plugin: developing-a-plugin.md

plugins:
  - techdocs-core
```

## Running Locally

You can install this package locally using `pip` and the `--editable` flag used for making developing Python packages.

```bash
pip install --editable .
```

You'll then have the `techdocs-core` package available to use in Mkdocs and `pip` will point the dependency to this folder.

## Running with Docker

In the parent `Dockerfile` we add this folder to the build and install the package locally in the container. In the future, we'll probably move away from this approach and have it download directly from a Python registry (and this folder will publish to one).

See the `README.md` located in the `techdocs-container/` folder for more details on how to build and run the Docker container.

## Linting

```bash
pip install -r requirements.txt
python -m black src/
```

**Note:** This will write to all Python files in `src/` with the formatted code. If you would like to only check to see if it passes, simply append the `--check` flag.

## MkDocs plugins and extensions

The TechDocs Core MkDocs plugin comes with a set of extensions and plugins that mkdocs supports. Below you can find a list of all extensions and plugins that are included in the
TechDocs Core plugin:

Plugins:

- [search](https://www.mkdocs.org/user-guide/configuration/#search)
- [mkdocs-monorepo-plugin](https://github.com/spotify/mkdocs-monorepo-plugin)

Extensions:

- [admonition](https://squidfunk.github.io/mkdocs-material/reference/admonitions/#admonitions)
- [toc](https://python-markdown.github.io/extensions/toc/)
- [pymdown](https://facelessuser.github.io/pymdown-extensions/)
  - caret
  - critic
  - details
  - emoji
  - superfences
  - inlinehilite
  - magiclink
  - mark
  - smartsymobls
  - highlight
  - extra
  - tabbed
  - tasklist
  - tilde
- [markdown_inline_graphviz](https://pypi.org/project/markdown-inline-graphviz/)
- [plantuml_markdown](https://pypi.org/project/plantuml-markdown/)

## Changelog

### 0.0.10

- Pin Markdown version to fix issue with Graphviz

### 0.0.9

- Change development status to 3 - Alpha

### 0.0.8

- Superfences and Codehilite doesn't work very well together (squidfunk/mkdocs-material#1604) so therefore the codehilite extension is replaced by pymdownx.highlight

* Uses pymdownx extensions v.7.1 instead of 8.0.0 to allow legacy_tab_classes config. This makes the techdocs core plugin compatible with the usage of tabs for grouping markdown with the following syntax:

````
    ```java tab="java 2"
        public void function() {
            ....
        }
    ```
````

as well as the new

````
    === "Java"

    ```java
    public void function() {
        ....
    }
    ```
````

The pymdownx extension will be bumped too 8.0.0 in the near future.

- pymdownx.tabbed is added to support tabs to group markdown content, such as codeblocks.

- "PyMdown Extensions includes three extensions that are meant to replace their counterpart in the default Python Markdown extensions." Therefore some extensions has been taken away in this version that comes by default from pymdownx.extra which is added now (https://facelessuser.github.io/pymdown-extensions/usage_notes/#incompatible-extensions)

### 0.0.7

- Fix an issue with configuration of emoji support

### 0.0.6

- Further adjustments to versions to find ones that are compatible

### 0.0.5

- Downgrade some versions of markdown extensions to versions that are more stable

### 0.0.4

- Added support for more mkdocs extensions
  - mkdocs-material
  - mkdocs-monorepo-plugin
  - plantuml-markdown
  - markdown_inline_graphviz_extension
  - pygments
  - pymdown-extensions
