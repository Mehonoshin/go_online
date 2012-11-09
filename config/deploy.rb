require 'bundler/capistrano'
require "capistrano-resque"

set :application, "go_online"

set :default_stage, "staging"
set :stages, %w(production staging)
require 'capistrano/ext/multistage'

set :scm, :git
set :repository,  "git@github.com:Mehonoshin/go_online.git"
set :deploy_via, :remote_cache

after "deploy", "deploy:cleanup"
# Нужно, так как простой after deploy не вызается после deploy:migrations
after "deploy:migrations", "deploy:cleanup"
#after "deploy:restart", "resque:restart"

load 'deploy/assets'

require './config/boot'
#require 'airbrake/capistrano'

