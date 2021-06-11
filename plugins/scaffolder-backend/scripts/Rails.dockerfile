FROM ruby:3.0

RUN apt-get update -qq && \
    apt-get install -y \
    nodejs \
    postgresql-client \
	git

RUN gem install rails
