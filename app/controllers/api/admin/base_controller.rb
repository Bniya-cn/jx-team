class Api::Admin::BaseController < ApplicationController
  before_action :require_logged_in
  before_action :require_admin
end
