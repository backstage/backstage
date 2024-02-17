FROM ruby:3.3@sha256:5dbf566f4fb0aadf3a61346258d5b8d7e07bdfefc473a9f3eb1c619e9e8de178

RUN apt-get update -qq && \
    apt-get install -y nodejs postgresql-client git && \
    rm -rf /var/lib/apt/lists/

RUN gem install rails
