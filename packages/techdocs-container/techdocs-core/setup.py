"""
Copyright 2020 Spotify AB

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""
from setuptools import setup, find_packages


setup(
    name="mkdocs-techdocs-core",
    version="0.0.8",
    description="A Mkdocs package that contains TechDocs defaults",
    long_description="",
    keywords="mkdocs",
    url="https://github.com/spotify/backstage",
    author="TechDocs Core",
    author_email="pulp-fiction@spotify.com",
    license="Apache-2.0",
    python_requires=">=3.7",
    install_requires=[
        "mkdocs>=1.1.2",
        "mkdocs-material==5.3.2",
        "mkdocs-monorepo-plugin==0.4.5",
        "plantuml-markdown==3.1.2",
        "markdown_inline_graphviz_extension==1.1",
        "pygments==2.6.1",
        "pymdown-extensions==7.1",
    ],
    classifiers=[
        "Development Status :: 1 - Planning",
        "Intended Audience :: Developers",
        "Intended Audience :: Information Technology",
        "License :: OSI Approved :: Apache Software License",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3 :: Only",
        "Programming Language :: Python :: 3.7",
    ],
    packages=find_packages(),
    entry_points={"mkdocs.plugins": ["techdocs-core = src.core:TechDocsCore"]},
)
