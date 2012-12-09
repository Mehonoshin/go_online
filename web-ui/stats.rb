# encoding: utf-8
require 'sinatra'
require 'haml'
require 'mongo_mapper'
#require './models/user'
#require './models/match'
#require './config/db.rb'
require 'will_paginate'
require 'will_paginate/view_helpers/sinatra'

class Stats < Sinatra::Base
  helpers WillPaginate::Sinatra::Helpers

  before do
    @request = request
  end

  get '/' do
    haml :index
  end

end


