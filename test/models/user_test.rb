require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test '密码加密后可通过 is_password? 验证' do
    user = User.create!(username: 'tester', email: 'test@example.com', password: 'secret12')
    assert user.is_password?('secret12')
    assert_not user.is_password?('wrongpass')
  end

  test '创建用户时自动生成 session_token' do
    user = User.create!(username: 'token_user', email: 'token@example.com', password: 'secret12')
    assert user.session_token.present?
  end

  test 'find_by_credentials 凭用户名密码查找用户' do
    user = User.create!(username: 'cred_user', email: 'cred@example.com', password: 'secret12')
    found = User.find_by_credentials('cred_user', 'secret12')
    assert_equal user.id, found.id
    assert_nil User.find_by_credentials('cred_user', 'bad')
  end
end
