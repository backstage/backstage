"""
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
"""
from setuptools import setup, find_packages


setup(
    name='mkdocs-techdocs-core',
    version='0.0.1',
    description='A Mkdocs package that contains TechDocs defaults',
    long_description='',
    keywords='mkdocs',
    url='https://github.com/spotify/backstage',
    author='Spotify',
    author_email='fossboard@spotify.com',
    license='Apache-2.0',
    python_requires='>=3.7,<3.8',
    install_requires=[
        'mkdocs>=1.1.2'
    ],
    classifiers=[
        # 'Development Status :: 4 - Beta',
        'Intended Audience :: Developers',
        'Intended Audience :: Information Technology',
        'License :: OSI Approved :: Apache Software License',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3 :: Only',
        'Programming Language :: Python :: 3.7'
    ],
    packages=find_packages(),
    entry_points={
        'mkdocs.plugins': [
            'techdocs-core = src.core:TechDocsCore'
        ]
    }
)
