from setuptools import setup, find_packages


setup(
    name='mkdocs-techdocs-core',
    version='0.1.0',
    description='A Mkdocs package that contains TechDocs defaults',
    long_description='',
    keywords='mkdocs',
    url='https://github.com/spotify/backstage',
    author='Spotify',
    author_email='foss@spotify.com',
    license='Apache-2.0',
    python_requires='>=3.7,<3.8',
    install_requires=[
        'mkdocs>=1.1.2'
    ],
    classifiers=[
        # 'Development Status :: 4 - Beta',
        'Intended Audience :: Developers',
        'Intended Audience :: Information Technology',
        'License :: OSI Approved :: Apache 2.0',
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
