#set :whenever_command, "bundle exec whenever"
#require "whenever/capistrano"

# Env
set :rails_env, "production"

# Deploy path
set :user, "go"
set :domain, "cspub.net"
set :use_sudo, false
set :deploy_to, "/home/go/go_online"
set :branch, "master"

# Roles
role :app, domain
role :web, domain
role :db, domain, :primary => true
#role :resque_worker, domain

# DB
task :copy_database_config, roles => :app do
  db_config = "#{release_path}/config/database.production.yml"
  run "cp #{db_config} #{release_path}/config/database.yml"
end
before "deploy:finalize_update", :copy_database_config

# Bundler
#bundle_path = "/usr/local/bin/bundle"

# Rake
set :rake, "cd #{release_path} && #{bundle_path} exec rake"

# Unicorn
set :unicorn_conf, "#{current_path}/config/unicorn/unicorn.production.rb"
set :unicorn_pid, "#{shared_path}/pids/unicorn.pid"

#task :copy_backup_conf, roles => :app do
  #backup_config = "#{deploy_to}/shared/backup_confs"
  #run "cp -r #{backup_config} #{release_path}/config/backup"
#end

task :create_sockets_dir, roles => :app do
  run "mkdir -p #{shared_path}/sockets"
end
before "deploy:finalize_update", :create_sockets_dir
before "deploy:finalize_update", :copy_backup_conf

namespace :deploy do
  desc "Start application"
  task :start, :roles => :app do
    run "cd #{current_release} && #{bundle_path} exec unicorn -Dc #{unicorn_conf}"
  end

  desc "Stop application"
  task :stop, :roles => :app do
    run "[ -f #{unicorn_pid} ] && kill -QUIT `cat #{unicorn_pid}`"
  end

  desc "Restart Application"
  task :restart, :roles => :app do
    run "[ -f #{unicorn_pid} ] && kill -USR2 `cat #{unicorn_pid}` || #{bundle_path} exec --gemfile #{current_path}/Gemfile unicorn -Dc #{unicorn_conf}"
  end
end

