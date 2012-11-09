source 'https://rubygems.org'

gem 'rails', '3.2.8'

gem 'sqlite3'

gem 'unicorn'
gem 'devise', "1.5.3"
gem 'devise-russian'


gem 'haml'

group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'
  gem 'uglifier', '>= 1.0.3'
end

gem 'jquery-rails'
gem 'newrelic_rpm'

group :development do
  gem 'therubyracer', '0.11.0beta5'
  gem 'libv8', '~> 3.11.8'
  gem 'letter_opener'
  gem 'ultimate-log-silencer'
  gem 'dev_must_have' , :git => "https://github.com/evrone/dev_must_have" #, :path => "~/Projects/dev_must_have"
  gem 'capistrano-ext'
  gem 'capistrano'
  gem "capistrano-sync", :git => "git://github.com/Mehonoshin/capistrano-sync.git"
  gem 'growl_notify'
  gem 'annotate', :git => 'git://github.com/ctran/annotate_models.git'
  gem 'guard-annotate'
  gem 'guard-resque'
  gem 'hirb'
  gem 'showoff-io'
  gem 'thin'
end

group :test, :development do
  gem 'rspec-rails'
  gem 'capybara'
  # gem 'rb-fsevent'
  gem 'launchy'
  gem 'database_cleaner'
  gem 'factory_girl_rails'
  gem 'mocha'
end

group :test do
  gem 'fakeweb'
end

#group :production do
  # Временно, тк backup зависит от старой версии fog
  #gem "backup", :git => "https://github.com/Mehonoshin/backup.git"
  #gem "fog"
  #gem "net-sftp", "~> 2.0.5"
#end

