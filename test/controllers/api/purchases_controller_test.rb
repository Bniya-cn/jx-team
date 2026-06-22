require 'test_helper'

class Api::PurchasesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = User.create!(username: 'api_buyer', email: 'api@example.com', password: 'secret12')
    @game = Game.create!(
      title: 'API Game',
      developer: 'Dev',
      publisher: 'Pub',
      price: 1500,
      release_date: Date.today,
      genre: 'strategy'
    )
  end

  test '未登录时不能购买' do
    post api_purchases_url, params: { purchase: { buyerId: @user.id, gameId: @game.id } }, as: :json
    assert_response :unauthorized
  end

  test '登录后可以购买' do
    post api_session_url, params: { user: { username: 'api_buyer', password: 'secret12' } }, as: :json
    assert_response :success

    post api_purchases_url, params: { purchase: { buyerId: @user.id, gameId: @game.id } }, as: :json
    assert_response :success
    assert_equal 1, Purchase.count
  end
end
