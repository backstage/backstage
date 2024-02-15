FROM ruby:3.3@sha256:2eaa8cbedeb86e7e214653a6b189e4d5ce181112179441d83498eedee080a9f7

RUN apt-get update -qq && \
    apt-get install -y nodejs postgresql-client git && \
    rm -rf /var/lib/apt/lists/

RUN gem install rails
