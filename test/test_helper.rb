ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

class ActiveSupport::TestCase
  # 测试数据在各自测试文件中创建，避免空 fixture 干扰
end
