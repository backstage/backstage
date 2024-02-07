FROM ruby:3.3@sha256:edc0719e887ae8a34c9edfe0178333117cb6fbfd6f49502dbccc8ae22d26a63e

RUN apt-get update -qq && \
    apt-get install -y nodejs postgresql-client git && \
    rm -rf /var/lib/apt/lists/

RUN gem install rails
