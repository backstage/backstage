FROM ruby:3.3@sha256:6936c28e1221d653c0d9af9d2b6a9e27ba0350cd10c9cc57464c62743d723b76

RUN apt-get update -qq && \
    apt-get install -y nodejs postgresql-client git && \
    rm -rf /var/lib/apt/lists/

RUN gem install rails
