require 'bundler'
Bundler.setup :default
require './web-ui/stats.rb'
require 'sprockets'
require 'yui/compressor'
require 'closure-compiler'

map '/assets' do
  environment = Sprockets::Environment.new
  environment.append_path 'assets/javascripts'
  environment.append_path 'assets/stylesheets'
  if ENV['SINATRA_ENV'] == 'production'
    environment.js_compressor = Closure::Compiler.new
    environment.css_compressor = YUI::CssCompressor.new
  end
  run environment
end

map '/' do
  run Stats
end

